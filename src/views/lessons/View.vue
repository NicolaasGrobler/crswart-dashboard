<template>
  <section class="container">
    <div class="tile is-vertical is-ancestor box">
      <h1>All Lessons</h1>
        <div v-for="lesson in lessons" :key="lesson.id" style="border: 1px solid black; border-radius: 5px; padding: 20px; margin-bottom: 20px;">
            <h3>{{lesson.author}} - {{new Date(lesson.date).toLocaleDateString('en-GB')}}</h3>
            <h4>Grade: {{lesson.grade}}</h4>
            <h4>Subject: {{lesson.subject}}</h4>
            <pre v-html="lesson.description"></pre>
            <h4>Files:</h4>
            <ul>
                <li v-for="(file, index) in JSON.parse(lesson.files)" :key="index">
                    <a :href="file.file_url" target="_blank">{{file.file_name}}</a>
                </li>
            </ul>
        </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
export default {
  name: "View Lessons",
  title: "CR Swart Lessons",
  data() {
    return {
        lessons: [],
    };
  },
  mounted() {
    this.getLessons();
  },
  methods: {
    async getLessons() {
      axios
        .get("auth/lessons")
        .then((response) => {
          this.lessons = response.data.lessons;
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

<style></style>
