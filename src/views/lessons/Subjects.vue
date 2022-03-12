<template>
  <section class="container">
      <div class="box tile">
          <b-button
            class="button is-primary"
            @click="$router.push('/lessons/')"
            icon-left="arrow-left"
            >View Grades</b-button>
      </div>
    <div class="tile box is-vertical" style="padding: 10px">
      <router-link v-for="subject in subjects" :key="subject.id" :to="`/lessons/subjects/${grade}/${subject.name}`">{{subject.name}}</router-link>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "Subjects",
  data() {
    return {
      grade: null,
      subjects: [],
    };
  },
  mounted() {
    this.grade = this.$route.params.grade;
    this.getSubjects();

    console.log(this.subjects);
  },
  methods: {
    async getSubjects() {
      axios
        .get(`/subjects/grade/${this.grade}`)
        .then((response) => {
          this.subjects = response.data.subjects;
        })
        .catch(() => {
          this.$buefy.toast.open({
            duration: 2000,
            message: "Failed to get subjects. Please refresh.",
            type: "is-danger",
          });
        });
    },
  },
};
</script>

<style></style>
