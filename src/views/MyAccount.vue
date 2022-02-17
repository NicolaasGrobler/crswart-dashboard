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
              label="Reset Password"
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
