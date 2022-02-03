<template>
  <section class="container">
    <div class="tile is-vertical box">
      <h2 class="date">{{new Date(lesson.date).toLocaleDateString('en-GB')}}</h2>
      <h1 class="author">{{lesson.author}}</h1>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "LessonView",
  title: "CR Swart Lesson Viewer",
  data() {
    return {
      lesson: null,
    };
  },
  mounted() {
    axios
      .get(`/auth/lesson/${this.$route.params.uuid}`)
      .then((response) => {
        this.lesson = response.data.lesson;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style>
.date {
  margin: 0px !important;
  padding: 0px !important;
}

.author {
  margin: 0px !important;
  margin-top: 20px !important;
  padding: 0px !important;
}
</style>
