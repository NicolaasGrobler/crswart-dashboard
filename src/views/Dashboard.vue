<template>
  <section class="my-dashboard">
    <div class="sidebar-container">
      <div class="my-sidebar">
        <!-- Emblem -->
        <img src="../assets/img/emblem.png" alt="Emblem" width="50" />
        <!-- App Title -->
        <h1 class="app-title">CR Swart</h1>
      </div>

      <!-- App Menu -->
      <AppMenu></AppMenu>

      <!-- Logout -->
      <div class="logout-container">
        <b-button
          class="logout-button"
          icon="logout"
          type="is-danger"
          expanded
          outlined
          @click="logout"
          >Logout</b-button
        >
      </div>
    </div>
    <div class="my-content">
      <ContentMain></ContentMain>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import ContentMain from "../components/ContentMain.vue";
import AppMenu from "../components/AppMenu.vue";

export default {
  name: "Dashboard",
  title: "CR Swart Dashboard",
  components: {
    ContentMain,
    AppMenu,
  },
  data() {
    return {
      is_loading: false,
      isActive: true,
    };
  },
  mounted() {
    this.getUserData();
  },
  methods: {
    async logout() {
      // Start loading animation
      this.is_loading = true;

      // Send post request to the server with token as header (Authorization) to logout user
      await axios
        .post("auth/logout")
        .then((response) => {
          this.$buefy.toast.open({
            message: response.data.title,
            type: "is-success",
          });
        })
        .catch((error) => {
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
    getUserData() {
      axios
        .get("auth/current")
        .then((response) => {
          this.$store.commit("setUser", response.data.user);

          if (response.data.user.password_reset) {
            this.$buefy.dialog.confirm({
              title: "Password Change",
              message: `We would recommend that you create your own secure password. You can however choose to keep your current password.`,
              cancelText: "Keep Current Password",
              confirmText: "Create New Password",
              type: "is-success",
              onConfirm: () => {
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
                    await axios
                      .put("auth/current/password", {
                        password: value,
                        email: this.$store.state.user.email,
                      })
                      .then((response) => {
                        this.$buefy.toast.open({
                          message: response.data.title,
                          type: "is-success",
                        });
                      })
                      .catch((error) => {
                        this.$buefy.toast.open({
                          message: error.response.data.title,
                          type: "is-danger",
                        });
                      });

                    close();
                  },
                  onCancel: () => {
                    axios
                      .put("auth/current/password", {
                        password: undefined,
                      })
                      .then(() => {
                        this.$buefy.toast.open("Current password was kept");
                      })
                      .catch((error) => {
                        this.$buefy.toast.open({
                          message: error.response.data.title,
                          type: "is-danger",
                        });
                      });
                  },
                });
              },
              onCancel: () => {
                axios
                  .put("auth/current/password", {
                    password: undefined,
                  })
                  .then(() => {
                    this.$buefy.toast.open("Current password was kept");
                  })
                  .catch((error) => {
                    this.$buefy.toast.open({
                      message: error.response.data.title,
                      type: "is-danger",
                    });
                  });
              },
            });
          }
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
  },
};
</script>

<style scoped>
.my-dashboard {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
}

.sidebar-container {
  flex: 1;
  max-width: 300px;
  min-width: 250px;
  background-color: #f8f8f8;
  border-right: 1px solid rgb(235, 235, 235);

  display: flex;
  flex-direction: column;
}

.my-sidebar {
  padding: 20px;
  display: flex;
  border-bottom: 1px solid rgb(235, 235, 235);
}

.app-menu {
  padding: 20px;
  flex: 1;
}

.logout-container {
  border-top: 1px solid rgb(235, 235, 235);
  padding: 20px;
}

.my-content {
  flex: 1;
  min-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 20px;
  overflow: auto;
  overflow-y: scroll;
}

.app-title {
  margin-left: 30px;
  font-size: 2rem;
  font-weight: bold;
}
</style>
