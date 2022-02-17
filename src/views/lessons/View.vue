<template>
  <section class="container">
    <!-- TODO: Split into views with transition animation -->

    <div class="tile is-vertical box" v-show="displayGrade">
      <div class="grade" @click="showSubjects(8)">Grade 8</div>
      <div class="grade" @click="showSubjects(9)">Grade 9</div>
      <div class="grade" @click="showSubjects(10)">Grade 10</div>
      <div class="grade" @click="showSubjects(11)">Grade 11</div>
      <div class="grade" @click="showSubjects(12)">Grade 12</div>
    </div>

    <div
      class="tile is-vertical box subjectsContainer"
      v-show="displaySubjects"
    >
      <b-button
        type="is-primary"
        icon-left="arrow-left"
        style="width: max-content; margin: 10px"
        @click="showGrades"
      >
        Grade
      </b-button>
      <div style="display: flex">
        <div
          class="subject"
          v-for="(subject, index) in subjects"
          :key="index"
          @click="getLessons(subject.name)"
        >
          {{ subject.name }}
        </div>
      </div>
    </div>

    <div class="tile is-vertical box" v-show="displayLessons">
      <h1>{{ subject }}</h1>
      <b-button
        type="is-primary"
        icon-left="arrow-left"
        style="width: max-content; margin-bottom: 20px"
        @click="showSubjects(grade)"
      >
        Subjects
      </b-button>
      <div
        @click="viewLesson(lesson.uuid)"
        class="box lesson_box"
        v-for="(lesson, index) of lessons"
        :key="index"
        style="
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        Grade {{ lesson.grade }} - {{ lesson.subject }}
        <div style="display: flex">
          <p style="display: flex; align-items: center; margin-bottom: 0px; margin-right: 10px;">
            <b-icon icon="calendar" style="margin-right: 5px; color: #555">
            </b-icon>
            {{ new Date(lesson.date).toLocaleDateString("en-GB") }}
          </p>
          <p
            class="date"
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
  </section>
</template>

<script>
import axios from "axios";
export default {
  name: "Lessons",
  title: "CR Swart Lessons",
  data() {
    return {
      lessons: [],
      subjects: [],
      displayGrade: true,
      displaySubjects: false,
      displayLessons: false,
      grade: "",
      subject: "",
    };
  },
  mounted() {
    this.getLessons();
  },
  methods: {
    showGrades() {
      this.displayGrade = true;
      this.displaySubjects = false;
      this.displayLessons = false;
    },
    async showSubjects(grade) {
      this.grade = grade;
      await this.getSubjects(this.grade);
      this.displayGrade = false;
      this.displaySubjects = true;
      this.displayLessons = false;
    },
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
    async getLessons(subject) {
      this.subject = subject;

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

      this.displayGrade = false;
      this.displaySubjects = false;
      this.displayLessons = true;
    },
    viewLesson(uuid) {
      this.displayGrade = false;
      this.displaySubjects = false;
      this.displayLessons = false;

      this.$router.push(`/lessons/${uuid}`);
    },
  },
};
</script>

<style scoped>
.grade {
  width: 100%;
  height: 100px;
  background: #b89c6a;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.grade:hover {
  background: #947e59;
  color: white;
}

.subject {
  background: #b89c6a;
  cursor: pointer;
  height: 150px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
  border-radius: 5px;
  font-size: 20px;
  font-weight: 700;
  color: white;
  transition: background 0.2s;
}

.subject:hover {
  background: #947e59;
  color: white;
}

.lesson_box {
  cursor: pointer;
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
</style>
