<template>
  <section class="container">
      <div class="box tile">
          <b-button
            class="button is-primary"
            @click="$router.push('/lessons/')"
            icon-left="arrow-left"
            >View Grades</b-button>
      </div>
    <div class="tile box is-vertical" style="padding: 20px">
        <h3>Grade {{grade}} subjects</h3>
      <router-link v-for="subject in subjects" :key="subject.id" :to="`/lessons/subjects/${grade}/${subject.name}`" class="button-link">{{subject.name}}</router-link>
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

<style>
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
