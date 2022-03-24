<template>
  <div style="height: 100%">
    <section
      v-show="isLoading"
      style="width: 100%; height: 100%; position: relative"
    >
      <b-loading :is-full-page="false" v-model="isLoading"></b-loading>
    </section>
    <transition name="fade" mode="out-in">
      <section class="container" style="padding: 20px" v-show="!isLoading">
        <div class="tile is-ancestor box" style="padding: 30px">
          <div class="tile" style="align-items: center">
            <!-- Profile Picture -->
            <div
              :style="{ 'background-image': 'url(' + picture + ')' }"
              class="profile-picture"
              @click="isCardModalActive = true"
              v-if="picture.length > 0"
            ></div>
            <div
              class="profile-picture"
              v-else
              @click="isCardModalActive = true"
            >
              {{ $store.state.user.name[0] }}
            </div>
            <!-- User Details -->
            <div
              class="tile is-vertical"
              style="padding: 20px; justify-content: center; margin-left: 20px"
            >
              <!-- User Name -->
              <h1>
                {{ $store.state.user.title }} {{ $store.state.user.name }}
                {{ $store.state.user.surname }}
              </h1>
              <!-- User Email -->
              <b-field>
                <b-input
                  placeholder="Email"
                  :value="email"
                  type="email"
                  readonly
                  icon="email"
                >
                </b-input>
              </b-field>
              <b-field grouped style="margin-bottom: 20px">
                <!-- Title -->
                <b-field label="Title">
                  <b-select
                    placeholder="Select a title"
                    expanded
                    v-model="title"
                  >
                    <option
                      v-for="(title, index) in $store.state.titles"
                      :value="title.title"
                      :key="index"
                    >
                      {{ title.title }}
                    </option>
                  </b-select>
                </b-field>
                <!-- User Surname -->
                <b-field label="Surname" expanded>
                  <b-input placeholder="Surname" v-model="surname"> </b-input>
                </b-field>
                <!-- Grade -->
                <b-field label="Grade" v-if="grade != 0" expanded style="max-width: 100px;">
                  <b-input placeholder="Grade" v-model="grade"> </b-input>
                </b-field>
              </b-field>
              <!-- Password Reset button -->
              <b-field>
                <b-button
                  type="is-primary"
                  outlined
                  icon="key"
                  label="Save Changes"
                  style="margin-right: 10px"
                  @click="saveChanges"
                ></b-button>
                <b-button
                  type="is-danger"
                  icon="key"
                  label="Change Password"
                  @click="changePassword"
                ></b-button>
              </b-field>
            </div>
          </div>
        </div>

        <b-modal
          v-model="isCardModalActive"
          :width="640"
          scroll="keep"
          @after-leave="displayUpload = false"
        >
          <div class="card">
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
              "
            >
              <h3 style="margin: 20px 0px">Profile Picture</h3>
              <div
                :style="{ 'background-image': 'url(' + picture + ')' }"
                class="profile-picture profile-modal"
                v-if="picture.length > 0"
              ></div>
              <div class="profile-picture profile-modal" v-else>
                {{ $store.state.user.name[0] }}
              </div>
            </div>
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 30px;
                flex-direction: column;
              "
            >
              <transition name="fade" mode="out-in">
                <div style="width: 400px" v-if="displayUpload">
                  <b-field
                    class="file is-primary"
                    :class="{ 'has-name': !!file }"
                    style="width: 100%; margin-bottom: 10px"
                  >
                    <b-field class="file" style="width: 100%">
                      <b-upload
                        v-model="file"
                        expanded
                        :disabled="loading.save"
                      >
                        <a class="button is-primary is-fullwidth">
                          <b-icon icon="upload"></b-icon>
                          <span>{{ file.name || "Click to upload" }}</span>
                        </a>
                      </b-upload>
                    </b-field>
                  </b-field>
                </div>
              </transition>

              <div style="display: flex; width: 400px">
                <b-button
                  v-if="!displayUpload"
                  type="is-primary"
                  icon="camera"
                  label="Upload Picture"
                  style="margin-bottom: 30px; margin-right: 10px; flex: 1"
                  @click="uploadPicture"
                ></b-button>
                <b-button
                  v-else
                  type="is-primary"
                  icon="camera"
                  label="Save Picture"
                  style="margin-bottom: 30px; margin-right: 10px; flex: 1"
                  :loading="loading.save"
                  @click="savePicture"
                ></b-button>
                <!-- Remove profile picture -->
                <b-button
                  type="is-danger"
                  icon="trash"
                  label="Remove Picture"
                  :loading="loading.delete"
                  style="margin-bottom: 30px; flex: 1"
                  @click="removePicture"
                ></b-button>
              </div>
            </div>
          </div>
        </b-modal>
      </section>
    </transition>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MyAccount",
  title: "CR Swart Account",
  data() {
    return {
      title: "",
      surname: "",
      email: "",
      grade: "",
      picture: "",
      loading: {
        save: false,
        delete: false,
      },
      file: {},
      isCardModalActive: false,
      displayUpload: false,
      isLoading: true,
    };
  },
  async mounted() {
    await this.getProfile();

    setTimeout(() => {
      this.isLoading = false;
    }, 100);
  },
  methods: {
    uploadPicture() {
      this.displayUpload = true;
    },
    async savePicture() {
      if (!this.file.name) {
        this.$buefy.toast.open({
          message: "Please select a picture",
          duration: 2000,
          type: "is-danger",
        });
        return;
      }

      this.loading.save = true;

      let { url } = await axios
        // TODO: Change the url to the correct to a secure one
        .post("/lessons/s3URL", {
          file_name: this.file.name,
          file_type: this.file.type,
          file_extension: this.file.name.split(".").pop(),
        })
        .then((response) => {
          return response.data;
        });

      let axioInstance = axios.create();
      delete axioInstance.defaults.headers.common["Authorization"];

      let picture_url = url.split("?")[0];

      // Upload file to s3 bucket
      await axioInstance
        .put(url, this.file, {
          headers: {
            "Content-Type": this.file.type,
          },
        })
        .then((response) => {
          if (response.status !== 200) {
            this.$buefy.toast.open({
              message: "Error uploading profile picture",
              duration: 2000,
              type: "is-danger",
            });
          } else {
            axios
              .put("auth/profile/picture", {
                url: picture_url,
              })
              .then(async (response) => {
                this.$buefy.toast.open({
                  message: response.data.title,
                  duration: 2000,
                  type: "is-success",
                });

                // Update profile picture url in store
                this.$store.commit("updateProfilePicture", picture_url);

                await this.getProfile();

                this.displayUpload = false;

                this.file = {};
              })
              .catch((error) => {
                this.$buefy.toast.open({
                  message: error.response.data.title,
                  duration: 2000,
                  type: "is-danger",
                });
              });
          }
        });

      setTimeout(() => {
        this.loading.save = false;
      }, 100);
    },
    removePicture() {
      this.$buefy.dialog.confirm({
        title: "Deleting profile picture",
        message:
          "Are you sure you want to <b>delete</b> your profile picture? This action cannot be undone.",
        confirmText: "Delete Profile Picture",
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          this.loading.delete = true;

          // Delete users picture
          await axios
            .delete(`auth/profile/picture`)
            .then((response) => {
              this.$buefy.toast.open({
                message: response.data.title,
                duration: 2000,
                type: "is-success",
              });

              this.getProfile();
              this.$store.commit("updateProfilePicture", "");
            })
            .catch((error) => {
              this.$buefy.toast.open({
                message: error.response.data.title,
                duration: 2000,
                type: "is-danger",
              });
            });

          setTimeout(() => {
            this.loading.delete = false;
          }, 100);
        },
      });
    },
    deleteFiles(index) {
      this.files.splice(index, 1);
    },
    saveChanges() {
      axios
        .put("auth/profile", {
          title: this.title,
          surname: this.surname,
          grade: this.grade,
        })
        .then((response) => {
          this.$buefy.toast.open({
            duration: 2000,
            message: response.data.title,
            type: "is-success",
          });

          this.$store.commit("updateProfile", {
            title: this.title,
            surname: this.surname,
          });
        })
        .catch((error) => {
          this.$buefy.toast.open({
            duration: 2000,
            message: error.response.data.title,
            type: "is-danger",
          });
        });
    },
    async getProfile() {
      await axios
        .get("auth/current")
        .then((response) => {
          this.title = response.data.user.title;
          this.surname = response.data.user.surname;
          this.email = response.data.user.email;
          this.grade = response.data.user.grade;
          this.picture = response.data.user.picture;
        })
        .catch((error) => {
          this.$buefy.toast.open({
            duration: 2000,
            message: error.response.data.title,
            type: "is-danger",
          });
        });
    },
    async logout() {
      // Send post request to the server with token as header (Authorization) to logout user
      await axios.post("auth/logout").catch((error) => {
        this.$buefy.toast.open({
          message: error.response.data.title,
          type: "is-danger",
        });
      });
      //Delete tokens from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      this.$router.push("/login");
    },
    changePassword() {
      this.$buefy.dialog.prompt({
        message: "Create a new password",
        inputAttrs: {
          type: "password",
          placeholder: "Enter a new password",
          value: "",
        },
        confirmText: "Update Password",
        trapFocus: true,
        closeOnConfirm: false,
        onConfirm: async (value, { close }) => {
          let password = value;
          // Confirm password
          this.$buefy.dialog.prompt({
            message: "Confirm new password",
            inputAttrs: {
              type: "password",
              placeholder: "Enter password again",
              value: "",
            },
            confirmText: "Update Password",
            trapFocus: true,
            closeOnConfirm: false,
            onConfirm: async (value, { close }) => {
              if (password == value) {
                await axios
                  .put("auth/current/password", {
                    password: value,
                    email: this.$store.state.user.email,
                  })
                  .then(() => {
                    this.$buefy.toast.open({
                      message:
                        "Password successfully updated. Please login again.",
                      type: "is-success",
                      duration: 2000,
                    });

                    this.logout();
                  })
                  .catch((error) => {
                    this.$buefy.toast.open({
                      message: error.response.data.title,
                      type: "is-danger",
                    });
                  });
              } else {
                this.$buefy.toast.open({
                  message: "Passwords did not match thus was not changed",
                });
              }

              close();
            },
            onCancel: () => {
              this.$buefy.toast.open({
                message: "Password was not changed",
              });
            },
          });

          close();
        },
        onCancel: () => {
          this.$buefy.toast.open({
            message: "Password was not changed",
          });
        },
      });
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.profile-picture.profile-modal:hover {
  border: 3px solid rgb(235, 235, 235);
  cursor: default;
}

.profile-picture {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  border: 3px solid rgb(235, 235, 235);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 80px;
  font-weight: 700;
  color: white;
  background: #b89c69;
  transition: 0.3s;

  background-size: cover;
  background-position: center;
}

.profile-picture:hover {
  cursor: pointer;
  border-color: #856e43;
}

.my-tile {
  background: #f8f8f8;
  border-radius: 5px;
  border: 1px solid rgb(235, 235, 235);
}
</style>
