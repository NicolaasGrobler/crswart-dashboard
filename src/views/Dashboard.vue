<template>
  <section class="my-dashboard">
    <div class="sidebar-container">
      <div class="my-sidebar">
        <!-- App Title -->
        <h1 class="app-title">CR Swart</h1>
        <!-- Search Bar -->
          <b-field>
            <b-input placeholder="Search..." type="search" icon="magnify">
            </b-input>
          </b-field>
      </div>

      <!-- App Menu -->
        <div class="app-menu">
          <!-- Links -->
          <b-menu>
            <b-menu-list label="Menu">
              <b-menu-item
                icon="view-dashboard"
                label="Dashboard"
                :active="isActive"
              ></b-menu-item>
              <b-menu-item icon="shield-crown">
                <template #label="props">
                  Administrator
                  <b-icon
                    class="is-pulled-right"
                    :icon="props.expanded ? 'menu-up' : 'menu-down'"
                  ></b-icon>
                </template>
                <b-menu-item icon="account" label="Users"></b-menu-item>
                <b-menu-item icon="cellphone-link">
                  <template #label>
                    Devices
                    <b-dropdown
                      aria-role="list"
                      class="is-pulled-right"
                      position="is-bottom-left"
                    >
                      <template #trigger>
                        <b-icon icon="dots-vertical"></b-icon>
                      </template>
                      <b-dropdown-item aria-role="listitem"
                        >Action</b-dropdown-item
                      >
                      <b-dropdown-item aria-role="listitem"
                        >Another action</b-dropdown-item
                      >
                      <b-dropdown-item aria-role="listitem"
                        >Something else</b-dropdown-item
                      >
                    </b-dropdown>
                  </template>
                </b-menu-item>
                <b-menu-item
                  icon="cash-multiple"
                  label="Payments"
                  disabled
                ></b-menu-item>
              </b-menu-item>
              <b-menu-item icon="account" label="My Account">
                <b-menu-item label="Account data"></b-menu-item>
                <b-menu-item label="Addresses"></b-menu-item>
              </b-menu-item>
            </b-menu-list>
            <b-menu-list>
              <b-menu-item
                label="Expo"
                icon="link"
                tag="router-link"
                target="_blank"
                to="/expo"
              ></b-menu-item>
            </b-menu-list>
          </b-menu>
        </div>

      <!-- Logout -->
        <div class="logout-container">
          <b-button
            class="logout-button"
            icon="logout"
            type="is-danger"
            expanded
            @click="logout"
            >Logout</b-button
          >
        </div>
    </div>
    <div class="my-content">
      <ContentMain :user="user"></ContentMain>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import ContentMain from "../components/ContentMain.vue";

export default {
  name: "Dashboard",
  title: "CR Swart Dashboard",
  components: {
    ContentMain: ContentMain,
  },
  data() {
    return {
      user: {
        name: "",
      },
      is_loading: false,
      isActive: true,
    };
  },
  mounted() {
    axios
      .get("auth/user")
      .then((response) => {
        this.user = response.data.user;
      })
      .catch((error) => {
        if (error.response.data.error.name == "TokenExpiredError") {
          alert("Token Expired");
        } else if (
          error.response.data.error.name == "refreshTokenExpiredError"
        ) {
          alert("Refresh Token has expired");
          this.$router.push("/login");
        } else {
          alert("Token Invalid, please sign in again");
          //Delete token from local storage
          localStorage.removeItem("token");
          //Log User Out
          this.$router.push("/login");
        }
      });
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
  },
};
</script>

<style scoped>
.my-dashboard {
  display: flex;
  flex-direction: row;
  height: 100vh;
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
  flex-direction: column;
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
  flex: 2;
  min-width: 700px;
  overflow-x: scroll !important;
}

.app-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
