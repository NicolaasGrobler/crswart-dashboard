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
              :value="$store.state.user.email"
              type="email"
              readonly
              icon="email"
            >
            </b-input>
          </b-field>
          <b-field grouped style="margin-bottom: 20px;">
            <!-- Title -->
            <b-field label="Title">
              <b-input
                placeholder="Title"
                :value="$store.state.user.title"
                readonly
                icon="email"
              >
              </b-input>
            </b-field>
            <!-- User Surname -->
            <b-field label="surname" expanded>
              <b-input
                placeholder="Surname"
                :value="$store.state.user.surname"
                readonly
                icon="email"
              >
              </b-input>
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
export default {
  name: "MyAccount",
  title: "CR Swart Account",
  data() {
    return {};
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
