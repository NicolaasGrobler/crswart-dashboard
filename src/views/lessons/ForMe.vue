<template>
  <section class="container">
    <div class="tile box" style="padding: 10px">
      <b-checkbox-button
        v-model="subjectFilter"
        v-for="(item, index) in subjects"
        :key="index"
        :native-value="item.name"
        style="margin: 5px"
      >
        {{ item.name }}
      </b-checkbox-button>
    </div>

    <div class="tile is-vertical box" style="position: relative">
      <h3>Latest Grade {{ this.$store.state.user.grade }} Lessons</h3>

      <hr />

      <b-loading :is-full-page="false" v-model="isLoading"></b-loading>

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
        @click="openLesson(lesson.uuid)"
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
          }).length == 0 && !isLoading
        "
      >
        <h4>No lessons found</h4>
      </div>
    </div>
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
      isLoading: true,
    };
  },
  computed: {
    userGrade() {
      return this.$store.state.user.grade;
    },
  },
  methods: {
    async getLessons() {
      // Get all lessons created by current user
      await axios
        .get(`/lessons/grade/${this.userGrade}`)
        .then((response) => {
          setTimeout(() => {
            this.lessons = response.data;
            this.lessons = response.data.lessons;
            this.isLoading = false;
          }, 500);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSubjects() {
      axios
        .get(`subjects/grade/${this.userGrade}`)
        .then((response) => {
          console.log("Subjects", response.data);
          this.subjects = response.data.subjects;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    openLesson(uuid) {
      // Change route to view lesson
      this.$router.push({
        name: "Lesson View",
        params: {
          uuid: uuid,
        },
      });
    },
  },
  async mounted() {
    await this.getLessons();
    await this.getSubjects();
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
