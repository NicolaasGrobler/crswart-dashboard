<template>
  <section class="container">
    <h1>Dashboard</h1>
    <!-- Welcome Text -->
    <p>Welcome to the Dashboard {{ user.name }}.</p>
    <!-- Logout Button -->
    <b-button type="is-danger" :loading="is_loading" @click="logout" style="margin-top: 20px"
      >Logout</b-button
    >
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "Dashboard",
  data() {
    return {
      user: {
        name: "",
      },
      is_loading: false,
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

<style></style>
