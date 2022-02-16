<template>
  <section class="container">
    <div class="tile box">
      <b-field
        label="Subject Filter"
        message="Leave blank to show lessons from all subjects"
        expanded
      >
        <b-checkbox-button
          v-model="subjectFilter"
          :native-value="subject.name"
          v-for="(subject, index) in subjects"
          :key="index"
        >
          {{ subject.name }}
        </b-checkbox-button>
      </b-field>
    </div>
    <div class="tile is-vertical box">
      <h3>Latest Grade {{ this.$store.state.user.grade }} Lessons</h3>

      <hr />

      <div
        class="box lesson_box"
        v-for="(lesson, index) of lessons.filter((lesson) => {
          if (subjectFilter.length > 0) {
            return subjectFilter.includes(lesson.subject);
          } else {
            return true;
          }
        })"
        :key="index"
        style="
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        Grade {{ lesson.grade }} - {{ lesson.subject }}
        <p style="display: flex; align-items: center">
          <b-icon icon="calendar" style="margin-right: 5px; color: #555">
          </b-icon>
          {{ new Date(lesson.date).toLocaleDateString("en-GB") }}
        </p>
      </div>

      <div
        v-if="
          lessons.filter((lesson) => {
            if (subjectFilter.length > 0) {
              return subjectFilter.includes(lesson.subject);
            } else {
              return true;
            }
          }).length == 0
        "
      >
        <h4>No lessons found</h4>
      </div>
    </div>

    {{ this.$store.state.user.grade }}
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "ForMe",
  data() {
    return {
      lessons: [],
      lesson: {
        id: "",
        uuid: "",
        subject: "",
        grade: "",
        date: "",
        author: "",
        files: "[]",
      },
      isOpen: 0,
      subjects: [],
      subjectFilter: [],
    };
  },
  created() {
    this.getLessons();
    this.getSubjects();
  },
  methods: {
    getLessons() {
      console.log("User", this.$store.state.user);

      // Get all lessons created by current user
      axios
        .get(`/lessons/grade/${this.$store.state.user.grade}`)
        .then((response) => {
          console.log("Lessons", response.data.lessons);
          this.lessons = response.data.lessons;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSubjects() {
      console.log("User", this.$store.state.user);

      axios
        .get(`subjects/grade/${this.$store.state.user.grade}`)
        .then((response) => {
          console.log("Subjects", response.data);
          this.subjects = response.data.subjects;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style>
.lesson_box {
  cursor: pointer;
}

.lesson_box:hover {
  background: #f5f5f5;
}
</style>
