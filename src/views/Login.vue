<template>
  <div class="my-hero">
    <section class="my-sidebar">
      <img
        src="../assets/img/emblem.png"
        alt="School Emblem"
        class="logo"
        style="margin: 0 auto"
      />

      <div class="my-form" style="margin-top: 40px;">
        <h1>CR SWART DASHBOARD</h1>
        <p>Please login to continue.</p>

        <b-field label="Email" style="margin-top: 30px">
          <b-input placeholder="Enter e-mail" v-model="email"></b-input>
        </b-field>
        <b-field label="Password">
          <b-input
            placeholder="Enter password"
            type="password"
            password-reveal
            v-model="password"
          ></b-input>
        </b-field>

        <b-button
          type="is-primary"
          expanded
          style="margin-top: 10px"
          >Login</b-button
        >
      </div>
    </section>
    <div class="my-display"></div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
};
</script>

<style lang="scss">
.my-hero {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

.my-sidebar {
  flex: 1;
  max-width: 6 00px;
  min-width: 400px;
  /* background-color: #f8f8f8; */

  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
}

.my-form {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}

.my-display {
  flex: 2;
  background-color: #e06565;
  background: url("../assets/img/hero.png");
  background-size: cover;
  background-position: center;
}

.logo {
  width: 40%;
}

h1 {
  color: black;
  font-size: 25px !important;
  font-weight: 700 !important;
}
</style>
