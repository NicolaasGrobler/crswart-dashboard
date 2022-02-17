<template>
  <section class="container">
    <!-- User Info -->
    <div class="tile box">
      <div class="my-block">
        <div style="display: flex; align-items: center">
          <b-icon
            icon="notebook-multiple"
            size="mdi-24"
            style="margin-right: 10px"
          >
          </b-icon>
          <p style="font-size: 20px; font-weight: 700; margin: 0px">
            Total Lessons
          </p>
        </div>
        <p style="font-weight: 700; margin-top: 10px" class="my-block-value">
          {{ total_lessons }}
        </p>
      </div>
      <b-tooltip
        label="View My Lessons"
        position="is-bottom"
        style="margin-right: 20px; flex: 1;"
      >
        <div
          class="my-block interactive"
          style="margin-right: 0px"
          @click="$router.push('lessons/mine')"
        >
          <div style="display: flex; align-items: center">
            <b-icon
              icon="book-account"
              size="mdi-24"
              style="margin-right: 10px"
            >
            </b-icon>
            <p style="font-size: 20px; font-weight: 700; margin: 0px">
              My Lessons
            </p>
          </div>
          <p style="font-weight: 700; margin-top: 10px" class="my-block-value">
            {{ total_made }}
          </p>
        </div>
      </b-tooltip>
      <b-tooltip
        label="View Lesson"
        position="is-bottom"
        style="margin-right: 20px; flex: 1;"
      >
        <div
          class="my-block interactive"
          style="margin-right: 0px"
          @click="ViewLesson(latest_lesson.uuid)"
        >
          <div style="display: flex; align-items: center">
            <b-icon
              icon="book-account"
              size="mdi-24"
              style="margin-right: 10px"
            ></b-icon>
            <p style="font-size: 20px; font-weight: 700; margin: 0px">
              Latest Lesson
            </p>
          </div>
          <p style="font-weight: 700; margin-top: 10px" class="my-block-value">
            Grade {{ latest_lesson.grade }} - {{ latest_lesson.subject }}
          </p>
        </div>
      </b-tooltip>
      <div class="my-block">
        <div style="display: flex; align-items: center">
          <b-icon
            icon="book-clock"
            size="mdi-24"
            style="margin-right: 10px"
          ></b-icon>
          <p style="font-size: 20px; font-weight: 700; margin: 0px">
            Last Lesson Created On
          </p>
        </div>
        <p style="font-weight: 700; margin-top: 10px" class="my-block-value">
          {{ new Date(latest_lesson.date).toLocaleString("en-GB") }}
        </p>
      </div>
    </div>
    <!-- Totals by Subject -->
    <div class="tile box is-vertical">
      <h3>Totals by Subject</h3>
      <div style="display: flex">
        <div
          class="my-block"
          v-for="(subject, index) in subject_totals"
          :key="index"
        >
          <p style="font-size: 20px; font-weight: 700; margin: 0px">
            {{ subject.subject }}
          </p>
          <p style="font-weight: 700; margin-top: 10px" class="my-block-value">
            {{ subject.occurrence }}
          </p>
        </div>
      </div>
    </div>
    <!-- Totals by Grade -->
    <div class="tile box is-vertical">
      <h3>Totals by Grade</h3>
      <div style="display: flex">
        <div
          class="my-block"
          v-for="(grade, index) in grade_totals"
          :key="index"
        >
          <p style="font-size: 20px; font-weight: 700; margin: 0px">
            Grade {{ grade.grade }}
          </p>
          <p style="font-weight: 700; margin-top: 10px" class="my-block-value">
            {{ grade.occurrence }}
          </p>
        </div>
      </div>
    </div>
    <!-- Latest Lesson -->
    <div class="tile is-vertical box">
      <h3>Latest Lesson</h3>
      <div style="display: flex; justify-content: space-between">
        <h3 class="date grade">
          Grade {{ latest_lesson.grade }} - {{ latest_lesson.subject }}
        </h3>
        <div style="display: flex; align-items: center">
          <b-icon
            icon="calendar-month"
            size="mdi-24"
            style="margin-right: 10px; color: grey; margin-top: 4px"
          >
          </b-icon>
          <h3 class="date grade">
            {{ new Date(latest_lesson.date).toLocaleDateString("en-GB") }}
          </h3>
          <h3
            class="date grade"
            style="margin-left: 10px !important; background: #640b26"
            v-if="
              new Date(latest_lesson.updated_on).toLocaleDateString('en-GB') !=
              '01/01/1970'
            "
          >
            Updated
            {{ new Date(latest_lesson.updated_on).toLocaleDateString("en-GB") }}
          </h3>
        </div>
      </div>
      <div style="display: flex; align-items: center; margin-top: 20px">
        <b-icon
          icon="account"
          size="mdi-24"
          style="margin-right: 5px; color: grey"
        >
        </b-icon>
        <h3 class="author">{{ latest_lesson.author }}</h3>
      </div>
      <hr />
      <div>
        <h3>Lesson Description</h3>
        <div class="description box" v-html="latest_lesson.description"></div>
      </div>
      <div
        v-if="JSON.parse(latest_lesson.files.length > 0)"
        style="margin-top: 20px"
      >
        <h3>Files</h3>
        <div class="box">
          <div
            class="file"
            v-for="(file, index) in JSON.parse(latest_lesson.files)"
            :key="index"
          >
            <b-button
              :href="file.file_url"
              target="_blank"
              :download="file.file_url"
              tag="a"
              expanded
              icon-left="download"
              class="button is-primary"
              style="margin-bottom: 10px"
            >
              {{ file.file_name.split(".")[0] }}
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "Dash",
  data() {
    return {
      total_lessons: 0,
      total_made: 0,
      subject_totals: [],
      grade_totals: [],
      latest_lesson: {},
    };
  },
  mounted() {
    this.getTotalLessons();
    this.getTotalLessonsMade();
    this.getLatestLesson();
    this.getSubjectTotals();
  },
  methods: {
    getTotalLessons() {
      axios
        .get("/lessons")
        .then((response) => {
          this.total_lessons = response.data.lessons.length;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getTotalLessonsMade() {
      axios
        .get("/lessons/author/current")
        .then((response) => {
          this.total_made = response.data.lessons.length;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getLatestLesson() {
      axios
        .get("/lessons/author/current/latest")
        .then((response) => {
          console.log(response.data.lesson);
          this.latest_lesson = response.data.lesson[0];
        })
        .catch((error) => {
          console.log(error);
        });
    },
    ViewLesson(uuid) {
      this.$router.push({
        name: "Lesson View",
        params: {
          uuid: uuid,
        },
      });
    },
    getSubjectTotals() {
      axios
        .get(`lessons/author/current/totals`)
        .then((response) => {
          this.subject_totals = response.data.subjects;
          this.grade_totals = response.data.grades;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style>
.my-block {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  height: 100%;
  margin-right: 20px;
  min-width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
}

.my-block-value {
  background: white;
  min-width: 30px;
  padding: 3px 10px;
  border-radius: 5px;
  width: 100%;
}

.interactive {
  cursor: pointer;
  transition: background 0.2s;
}

.interactive:hover {
  background: #b89c6a;
  color: white;
}

.interactive:hover > .my-block-value {
  background: white;
  color: initial;
}

.date {
  margin: 0px !important;
  padding: 0px !important;
}

.author {
  margin: 0px !important;
  padding: 0px !important;
}

.description {
  margin-top: 20px;
  padding: 20px;
  border-radius: 5px;
}

.grade {
  color: white !important;
  background: #b89c6a;
  border-radius: 5px;
  padding: 10px !important;
  font-size: 16px !important;
}
</style>
