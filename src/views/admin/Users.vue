<template>
  <section class="container" style="padding: 20px;">
    <div class="tile is-ancestor box">
      <b-table :data="data" style="width: 100%" striped>
        <b-table-column
          field="name"
          label="Name"
          :td-attrs="columnTdAttrs"
          v-slot="props"
        >
          {{ props.row.name }}
        </b-table-column>

        <b-table-column
          field="email"
          label="Email"
          v-slot="props"
        >
          {{ props.row.email }}
        </b-table-column>

        <b-table-column
          field="controls"
          label="Controls"
          v-slot="props"
          width="200"
          centered
        >
          <b-button icon-left="account-edit" size="is-small" class="is-success" @click="editUser(props.row)"
            >Edit</b-button
          >
          <b-button icon-left="account-cancel" size="is-small" class="is-danger" @click="editUser(props.row)" style="margin-left: 10px;"
            >Delete</b-button
          >
        </b-table-column>
        <template #empty>
          <div class="has-text-centered">No records</div>
        </template>
      </b-table>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "Users",
  title: "CR Swart Users",
  data() {
    return {
      data: [
        {
          uuid: 1,
          name: "Jesse",
          email: "2016-10-15 13:43:27",
          gender: "Male",
        },
        {
          uuid: 2,
          name: "John",
          email: "2016-12-15 06:00:53",
          gender: "Male",
        },
        {
          uuid: 3,
          name: "Tina",
          email: "2016-04-26 06:26:28",
          gender: "Female",
        },
        {
          uuid: 4,
          name: "Clarence",
          email: "2016-04-10 10:28:46",
          gender: "Male",
        },
        {
          uuid: 5,
          name: "Anne",
          email: "2016-12-06 14:38:38",
          gender: "Female",
        },
      ],
    };
  },
  mounted() {
      // Get Users
      axios
      .get("auth/users")
      .then((response) => {
        this.data = response.data.users;
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
  }
};
</script>

<style></style>
