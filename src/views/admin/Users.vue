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
          width="200"
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
        </b-table-column>
        <template #empty>
          <div class="has-text-centered">No records</div>
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
        <section class="modal-card-body">
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
        </section>
        <footer class="modal-card-foot">
          <b-button
            label="Close"
            @click="closeEditModal"
            :disabled="is_modal_edit_loading"
          />
          <b-button
            label="Save User"
            type="is-primary"
            @click="editUser"
            :loading="is_modal_edit_loading"
          />
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
        title: "",
        name: "",
        surname: "",
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
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      // Get Users
      axios
        .get("auth/users")
        .then((response) => {
          this.data = response.data.users;
        })
        .catch(() => {
          this.$router.push("/login");
          this.$buefy.toast.open({
            duration: 2000,
            message: `Unauthorized`,
            type: "is-danger",
          });
        });
    },
    getUserData(uuid) {
      axios.get(`auth/user/${uuid}`).then((response) => {
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
      });
    },
    openCreateModal() {
      console.log(this.$store.state.titles);

      // Reset user data
      this.user = {
        uuid: "",
        title: "",
        name: "",
        surname: "",
        email: "",
        roles: [],
        password: null,
        upload_restrictions: [],
      };

      // Open Modal
      this.is_create_modal_active = true;
    },
    openEditModal(user_id) {
      this.getUserData(user_id);

      // Open Modal
      this.is_edit_modal_active = true;
      console.log(user_id);
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
          this.$buefy.toast.open({
            message: response.data.title,
            duration: 2000,
            type: "is-success",
          });
          this.is_modal_create_loading = false;
          this.getUsers();
          this.closeCreateModal();
        })
        .catch((error) => {
          this.$buefy.toast.open({
            message: error.response.data.title,
            duration: 2000,
            type: "is-danger",
          });
          this.is_modal_create_loading = false;
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

      // Create User
      let user = {
        ...this.user,
        upload_restrictions,
      };

      axios
        .put(`auth/user/${this.user.uuid}`, user)
        .then((response) => {
          this.$buefy.toast.open({
            message: response.data.title,
            duration: 2000,
            type: "is-success",
          });
          this.is_modal_edit_loading = false;
          this.is_edit_modal_active = false;
          this.getUsers();
        })
        .catch((error) => {
          this.$buefy.toast.open({
            message: error.response.data.title,
            duration: 2000,
            type: "is-danger",
          });
          this.is_modal_edit_loading = false;
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
  },
};
</script>

<style></style>
