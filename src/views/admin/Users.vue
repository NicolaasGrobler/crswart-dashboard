<template>
  <section class="container" style="padding: 20px">
    <div class="tile is-ancestor box" style="margin-bottom: 30px">
      <b-button type="is-primary" @click="openCreateModal">
        Create User
      </b-button>
    </div>
    <div class="tile is-vertical is-ancestor box">
      <b-field>
        <b-input
          placeholder="Search..."
          type="search"
          icon="magnify"
          v-model="search_term"
        >
        </b-input>
        <p class="control">
          <b-button type="is-primary" label="Search" />
        </p>
      </b-field>

      <b-table
        :data="
          data.filter((user) =>
            user.name.toLowerCase().includes(search_term.toLowerCase())
          )
        "
        :loading="isLoading"
        style="width: 100%"
        striped
      >
        <b-table-column field="name" label="Name" v-slot="props">
          {{ props.row.name }}
        </b-table-column>

        <b-table-column field="email" label="Email">
          <template v-slot="props">{{ props.row.email }}</template>
        </b-table-column>

        <b-table-column
          field="controls"
          label="Controls"
          v-slot="props"
          width="300"
          centered
        >
          <b-button
            icon-left="account-edit"
            size="is-small"
            class="is-success"
            @click="openEditModal(props.row.uuid)"
            >Edit</b-button
          >
          <b-button
            icon-left="account-cancel"
            size="is-small"
            class="is-danger"
            @click="deleteUser(props.row.uuid)"
            style="margin-left: 10px"
            >Delete</b-button
          >
          <b-button
            icon-left="lock"
            size="is-small"
            class="is-danger"
            outlined
            @click="resetPassword(props.row.email, props.row.uuid)"
            style="margin-left: 10px"
            >Reset Password</b-button
          >
        </b-table-column>
        <template #empty>
          <div class="has-text-centered" v-if="!isLoading">No records</div>
        </template>
      </b-table>
    </div>

    <!-- Create User Modal -->
    <b-modal
      v-model="is_create_modal_active"
      :width="640"
      scroll="keep"
      :can-cancel="!is_modal_create_loading"
    >
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title" style="margin-bottom: 0px">
            Create New User
          </p>
          <button
            class="delete"
            aria-label="close"
            @click="closeCreateModal"
          ></button>
        </header>
        <section class="modal-card-body">
          <b-field label="Title">
            <b-select
              placeholder="Select a title"
              expanded
              :disabled="is_modal_create_loading"
              v-model="user.title"
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
          <b-field grouped>
            <b-field label="First Name" expanded>
              <b-input
                v-model="user.name"
                placeholder="Enter new user's name"
                :disabled="is_modal_create_loading"
              ></b-input>
            </b-field>
            <b-field label="Last Name" expanded>
              <b-input
                v-model="user.surname"
                placeholder="Enter new user's surname"
                :disabled="is_modal_create_loading"
              ></b-input>
            </b-field>
          </b-field>
          <b-field label="Email">
            <b-input
              v-model="user.email"
              type="email"
              placeholder="Enter new user's email address"
              :disabled="is_modal_create_loading"
            ></b-input>
          </b-field>
          <b-field label="Role(s)" message="You can select multiple roles">
            <b-select
              placeholder="Select a title"
              expanded
              :disabled="is_modal_create_loading"
              multiple
              v-model="user.roles"
            >
              <option
                v-for="(role, index) in $store.state.roles"
                :value="role.value"
                :key="index"
              >
                {{ role.name }}
              </option>
            </b-select>
          </b-field>
          <b-field
            label="File Upload Restrictions"
            v-show="display_restrictions"
          >
            <b-taginput
              v-model="user.upload_restrictions"
              :data="filteredExtensions"
              autocomplete
              field="extension"
              allow-new
              open-on-focus
              placeholder="Add a file extension"
              @typing="getFilteredExtensions"
            >
            </b-taginput>
          </b-field>
          <b-field label="Student Grade" v-show="display_grade">
            <b-radio-button
              :disabled="is_modal_create_loading"
              v-model="user.grade"
              v-for="grade in [8, 9, 10, 11, 12]"
              :key="grade"
              :native-value="grade"
              type="is-primary"
            >
              <span>Grade {{ grade }}</span>
            </b-radio-button>
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <b-button
            label="Close"
            @click="closeCreateModal"
            :disabled="is_modal_create_loading"
          />
          <b-button
            label="Create User"
            type="is-primary"
            @click="createUser"
            :loading="is_modal_create_loading"
          />
        </footer>
      </div>
    </b-modal>

    <!-- Edit User Modal -->
    <b-modal
      v-model="is_edit_modal_active"
      :width="640"
      scroll="keep"
      :can-cancel="!is_modal_edit_loading"
    >
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title" style="margin-bottom: 0px">Edit User</p>
          <button
            class="delete"
            aria-label="close"
            @click="closeEditModal"
          ></button>
        </header>
        <section
          class="modal-card-body"
          style="position: relative; min-height: 500px"
          v-if="loading.edit"
        >
          <b-loading
            :is-full-page="false"
            v-model="loading.edit"
            :can-cancel="false"
          ></b-loading>
        </section>
        <section class="modal-card-body" v-else style="background: white">
          <b-field label="Title">
            <b-select
              placeholder="Select a title"
              expanded
              :disabled="is_modal_edit_loading"
              v-model="user.title"
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
          <b-field grouped>
            <b-field label="First Name" expanded>
              <b-input
                v-model="user.name"
                placeholder="Enter new user's name"
                :disabled="is_modal_edit_loading"
              ></b-input>
            </b-field>
            <b-field label="Last Name" expanded>
              <b-input
                v-model="user.surname"
                placeholder="Enter new user's surname"
                :disabled="is_modal_edit_loading"
              ></b-input>
            </b-field>
          </b-field>
          <b-field label="Email">
            <b-input
              v-model="user.email"
              type="email"
              placeholder="Enter new user's email address"
              :disabled="is_modal_edit_loading"
            ></b-input>
          </b-field>
          <b-field label="Role(s)" message="You can select multiple roles">
            <b-select
              placeholder="Select a title"
              expanded
              :disabled="is_modal_edit_loading"
              multiple
              v-model="user.roles"
            >
              <option
                v-for="(role, index) in $store.state.roles"
                :value="role.value"
                :key="index"
              >
                {{ role.name }}
              </option>
            </b-select>
          </b-field>
          <b-field label="File Upload Restrictions" v-if="display_restrictions">
            <b-taginput
              v-model="user.upload_restrictions"
              :data="filteredExtensions"
              autocomplete
              field="extension"
              allow-new
              open-on-focus
              placeholder="Add a file extension"
              @typing="getFilteredExtensions"
            >
            </b-taginput>
          </b-field>
          <b-field label="Student Grade" v-show="display_grade">
            <b-radio-button
              v-model="user.grade"
              v-for="grade in [8, 9, 10, 11, 12]"
              :key="grade"
              :native-value="grade"
              type="is-primary"
            >
              <span>Grade {{ grade }}</span>
            </b-radio-button>
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <b-button
            label="Close"
            @click="closeEditModal"
            :disabled="is_modal_edit_loading"
          />
          <transition name="fade" mode="out-in">
            <b-button
              v-show="!loading.edit"
              label="Save User"
              type="is-primary"
              @click="editUser"
              :loading="is_modal_edit_loading"
            />
          </transition>
        </footer>
      </div>
    </b-modal>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "Users",
  title: "CR Swart Users",
  data() {
    return {
      data: [],
      user: {
        uuid: "",
        title: undefined,
        name: "",
        surname: "",
        grade: "",
        email: "",
        roles: [],
        password: null,
        upload_restrictions: [],
      },
      filteredExtensions: this.$store.state.file_extensions,
      search_term: "",
      is_create_modal_active: false,
      is_modal_create_loading: false,
      is_edit_modal_active: false,
      is_modal_edit_loading: false,
      isLoading: true,
      loading: {
        edit: false,
      },
    };
  },
  computed: {
    display_restrictions() {
      try {
        if (
          this.user.roles.includes("admin") ||
          this.user.roles.includes("teacher")
        ) {
          return true;
        } else {
          return false;
        }
      } catch {
        return false;
      }
    },
    display_grade() {
      try {
        if (this.user.roles.includes("student")) {
          return true;
        } else {
          return false;
        }
      } catch {
        return false;
      }
    },
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async logout() {
      // Send post request to the server with token as header (Authorization) to logout user
      await axios
        .post("auth/logout")
        .then((response) => {
          console.log(response.data.title);
        })
        .catch((error) => {
          console.log(error.response.data.title);
        });
      //Delete tokens from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      this.$router.push("/login");
    },
    async getUsers() {
      this.isLoading = true;

      // Get Users
      await axios
        .get("auth/users")
        .then((response) => {
          setTimeout(() => {
            this.data = response.data.users;
            this.isLoading = false;
          }, 300);
        })
        .catch((error) => {
          setTimeout(() => {
            this.$buefy.toast.open({
              duration: 2000,
              message: error.response.data.title,
              type: "is-danger",
            });
            this.isLoading = false;
          }, 300);
        });
    },
    getUserData(uuid) {
      this.loading.edit = true;

      axios
        .get(`auth/user/${uuid}`)
        .then((response) => {
          setTimeout(() => {
            let upload_restrictions;

            if (response.data.user.upload_restrictions) {
              upload_restrictions = response.data.user.upload_restrictions
                .split(",")
                .map((ext) => {
                  return {
                    extension: ext,
                  };
                });
            } else {
              upload_restrictions = [];
            }

            this.user = {
              ...response.data.user,
              uuid,
              upload_restrictions,
            };

            this.loading.edit = false;
          }, 300);
        })
        .catch((error) => {
          setTimeout(() => {
            this.$buefy.toast.open({
              duration: 2000,
              message: error.response.data.title,
              type: "is-danger",
            });
            this.is_edit_modal_active = false;
            this.loading.edit = false;
          }, 300);
        });
    },
    openCreateModal() {
      console.log(this.$store.state.titles);

      // Reset user data
      this.user = {
        uuid: "",
        title: undefined,
        name: "",
        surname: "",
        email: "",
        grade: "",
        roles: [],
        password: null,
        upload_restrictions: [],
      };

      // Open Modal
      this.is_create_modal_active = true;
    },
    openEditModal(user_id) {
      this.loading.edit = true;

      // Open Modal
      this.is_edit_modal_active = true;

      // Get user data
      this.getUserData(user_id);
    },
    closeCreateModal() {
      if (this.is_modal_create_loading) {
        return;
      }

      this.is_create_modal_active = false;
    },
    closeEditModal() {
      if (this.is_modal_edit_loading) {
        return;
      }

      this.is_edit_modal_active = false;
      this.loading.edit = false;
    },
    async createUser() {
      this.is_modal_create_loading = true;

      let upload_restrictions = this.user.upload_restrictions;

      if (upload_restrictions.length > 0) {
        upload_restrictions = this.user.upload_restrictions
          .map((extension) => {
            return extension.extension;
          })
          .join(", ");
      }

      // Create User
      let user = {
        upload_restrictions,
        ...this.user,
      };

      await axios
        .post("/auth/register", user)
        .then((response) => {
          setTimeout(async () => {
            this.$buefy.toast.open({
              message: response.data.title,
              duration: 2000,
              type: "is-success",
            });
            this.is_modal_create_loading = false;
            this.closeCreateModal();
            this.getUsers();
          }, 300);
        })
        .catch((error) => {
          setTimeout(() => {
            this.$buefy.toast.open({
              message: error.response.data.title,
              duration: 2000,
              type: "is-danger",
            });
            this.is_modal_create_loading = false;
          }, 300);
        });
    },
    getFilteredExtensions(text) {
      this.filteredExtensions = this.$store.state.file_extensions.filter(
        (extension) => {
          return (
            extension.extension
              .toString()
              .toLowerCase()
              .indexOf(text.toLowerCase()) >= 0
          );
        }
      );
    },
    async editUser() {
      this.is_modal_edit_loading = true;

      let upload_restrictions = this.user.upload_restrictions;

      if (upload_restrictions.length > 0) {
        upload_restrictions = upload_restrictions
          .map((extension) => {
            return extension.extension;
          })
          .join(", ");
      }

      // Check if user is not a student then set grade to 0
      if (!this.user.roles.includes("student")) {
        this.user.grade = 0;
      }

      // Create User
      let user = {
        ...this.user,
        upload_restrictions,
      };

      axios
        .put(`auth/user/${this.user.uuid}`, user)
        .then((response) => {
          setTimeout(() => {
            this.$buefy.toast.open({
              message: response.data.title,
              duration: 2000,
              type: "is-success",
            });
            this.is_modal_edit_loading = false;
            this.is_edit_modal_active = false;
            this.getUsers();
          }, 300);
        })
        .catch((error) => {
          setTimeout(() => {
            this.$buefy.toast.open({
              message: error.response.data.title,
              duration: 2000,
              type: "is-danger",
            });
            this.is_modal_edit_loading = false;
          }, 300);
        });
    },
    async deleteUser(uuid) {
      this.$buefy.dialog.confirm({
        title: "Deleting subject",
        message:
          "Are you sure you want to <b>delete</b> this user? This action cannot be undone.",
        confirmText: "Delete User",
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          this.isLoading = true;

          // Delete user
          await axios
            .delete(`auth/user/${uuid}`)
            .then((response) => {
              this.$buefy.toast.open({
                message: response.data.title,
                duration: 2000,
                type: "is-success",
              });

              this.getUsers();
            })
            .catch((error) => {
              this.$buefy.toast.open({
                message: error.response.data.title,
                duration: 2000,
                type: "is-danger",
              });

              this.getUsers();
            });
        },
      });
    },
    async resetPassword(email, uuid) {
      this.$buefy.dialog.confirm({
        title: "Reseting Password",
        message:
          "Are you sure you want to <b>reset</b> this user's password? This action cannot be undone.",
        confirmText: "Reset Password",
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          // Open Loader
          // Open the loading indicator
          const loadingComponent = this.$buefy.loading.open({
            container: null,
          });

          // Delete user
          await axios
            .post(`auth/reset`, {
              email,
              uuid,
            })
            .then((response) => {
              this.$buefy.toast.open({
                message: response.data.title,
                duration: 2000,
                type: "is-success",
              });

              // Check if the user who's password is being set is the same as the current user by using the email
              if (this.$store.state.user.email === email) {
                this.logout();
              }

              this.getUsers();
            })
            .catch((error) => {
              this.$buefy.toast.open({
                message: error.response.data.title,
                duration: 2000,
                type: "is-danger",
              });

              this.getUsers();
            });

          // Close the loading indicator
          loadingComponent.close();
        },
      });
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.1s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
