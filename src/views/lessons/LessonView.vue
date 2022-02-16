<template>
  <section class="container">
    <div class="tile is-vertical box">
      <div style="display: flex; justify-content: space-between">
        <h3 class="date grade">Grade {{ lesson.grade }} - {{ lesson.subject }}</h3>
        <div style="display: flex; align-items: center;">
          <b-icon icon="calendar-month" size="mdi-24" style="margin-right: 10px; color: grey; margin-top: 4px;">
          </b-icon>
          <h3 class="date grade">
            {{ new Date(lesson.date).toLocaleDateString("en-GB") }}
          </h3>
          <h3 class="date grade" style="margin-left: 10px !important; background: #640B26;">
            Updated {{ lesson.updated_on != '0000-00-00 00:00:00' ? new Date(lesson.updated_on).toLocaleDateString("en-GB") : '' }}
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
        <h3 class="author">{{ lesson.author }}</h3>
      </div>
      <hr>
      <div>
        <h3>Lesson Description</h3>
        <div class="description box" v-html="lesson.description"></div>
      </div>
      <div v-if="JSON.parse(lesson.files.length > 0)" style="margin-top: 20px;">
        <h3>Files</h3>
        <div class="box">
          <div
            class="file"
            v-for="(file, index) in JSON.parse(lesson.files)"
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
              style="margin-bottom: 10px;"
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
  name: "LessonView",
  title: "CR Swart Lesson Viewer",
  data() {
    return {
      lesson: null,
    };
  },
  mounted() {
    axios
      .get(`/lessons/${this.$route.params.uuid}`)
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
  padding: 0px !important;
}

.description {
  margin-top: 20px;
  padding: 20px;
  border-radius: 5px;
}

.grade {
  color: white !important;
  background: #B89C6A;
  border-radius: 5px;
  padding: 10px !important;
  font-size: 16px !important;
}
</style>
