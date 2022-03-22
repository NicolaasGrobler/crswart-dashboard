<template>
  <section class="container">
    <div class="tile box is-vertical" style="padding: 20px;">
        <h3>Grades</h3>
      <router-link to="/lessons/subjects/8" class="button-link">Grade 8</router-link>
      <router-link to="/lessons/subjects/9" class="button-link">Grade 9</router-link>
      <router-link to="/lessons/subjects/10" class="button-link">Grade 10</router-link>
      <router-link to="/lessons/subjects/11" class="button-link">Grade 11</router-link>
      <router-link to="/lessons/subjects/12" class="button-link">Grade 12</router-link>
    </div>
  </section>
</template>

<script>
// import axios from "axios";

export default {
  name: "Grades",
  data() {
    return {
    };
  },
};
</script>

<style scoped>
.button-link {
    background: #B89C69;
    color: white;
    border-radius: 5px;
    padding: 20px;
    text-align: center;
    margin-bottom: 15px;
    transition: 0.1s;
}

.button-link:hover {
    background: #947E59;
    color: white;
}

.button-link:last-child {
    margin-bottom: 0;
}
</style>
