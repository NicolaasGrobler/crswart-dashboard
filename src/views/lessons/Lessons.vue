<template>
  <section class="container">
      <div class="box tile">
          <b-button
            class="button is-primary"
            @click="$router.push(`/lessons/subjects/${grade}`)"
            icon-left="arrow-left"
            >Grade {{grade}} subjects</b-button>
      </div>
    <div class="tile box is-vertical" style="padding: 20px">
        <h3>Grade {{grade}} - {{subject}} lessons</h3>
      <div v-if="lessons.length > 0 && !loading">
          <div
        class="box lesson_box"
        @click="viewLesson(lesson.uuid)"
        v-for="(lesson, index) of lessons"
        :key="index"
        style="
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <div>{{lesson.title}}</div>
        <div style="display: flex">
          <p
            style="
              display: flex;
              align-items: center;
              margin-bottom: 0px;
              margin-right: 10px;
            "
          >
            <b-icon icon="calendar" style="margin-right: 5px; color: #555">
            </b-icon>
            {{ new Date(lesson.date).toLocaleDateString("en-GB") }}
          </p>
          <p
            class="date grade"
            style="margin-left: 10px !important; background: #640b26"
            v-if="
              new Date(lesson.updated_on).toLocaleDateString('en-GB') !=
              '01/01/1970'
            "
          >
            Updated
            {{ new Date(lesson.updated_on).toLocaleDateString("en-GB") }}
          </p>
        </div>
      </div>
      </div>
        <div v-else-if="!loading">
            <hr>
            <h4>No lessons found.</h4>
        </div>
        <div v-else>
            <hr>
            <h4>Loading lessons...</h4>
        </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "Lessons",
  data() {
    return {
      grade: null,
      subject: null,
      lessons: [],
      loading: true,
    };
  },
  mounted() {
    this.grade = this.$route.params.grade;
    this.subject = this.$route.params.subject;

    this.getLessons();
  },
  methods: {
    async getLessons() {
      await axios
        .get(`/lessons/grade/${this.grade}/${this.subject}`)
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

        this.loading = false;
    },
    viewLesson(uuid) {
      this.$router.push(`/lessons/${uuid}`);
    },
  },
};
</script>

<style scoped>
.grade {
  width: 100%;
  background: #b89c6a;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}
.date {
  margin: 0px !important;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 10px !important;
}

.lesson_box {
  cursor: pointer;
  border: transparent solid 1px;
  transition: 0.1s;
}

.lesson_box:hover {
  border: #947e59 solid 1px;
}

.lesson_box:last-child {
    margin-bottom: 7px !important;
}
</style>
