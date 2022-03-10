<template>
  <section class="container" style="padding: 20px">
    <div class="tile is-ancestor box" style="padding: 30px">
      <div class="tile" style="align-items: center">
        <!-- Profile Picture -->
        <img
          src="https://thispersondoesnotexist.com/image"
          alt="Avatar"
          width="250"
          class="profile-picture"
        />
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
              <b-select placeholder="Select a title" expanded v-model="title">
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
            <b-field label="Grade" v-if="grade != 0" expanded>
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
  </section>
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
    };
  },
  mounted() {
    this.getProfile();
  },
  methods: {
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
    getProfile() {
      axios
        .get("auth/current")
        .then((response) => {
          this.title = response.data.user.title;
          this.surname = response.data.user.surname;
          this.email = response.data.user.email;
          this.grade = response.data.user.grade;
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

<style>
.profile-picture {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  border: 3px solid rgb(235, 235, 235);
}

.my-tile {
  background: #f8f8f8;
  border-radius: 5px;
  border: 1px solid rgb(235, 235, 235);
}
</style>
