<template>
  <section class="container">
    <div
      class="tile box"
      v-if="
        $store.state.user.uuid == lesson.author_uuid ||
        $store.state.user.roles.includes('admin')
      "
    >
      <!-- Edit -->
      <b-button
        class="is-primary"
        icon-left="pencil"
        @click="editLesson(lesson.uuid)"
        >Edit Lesson</b-button
      >
      <!-- Delete -->
      <b-button class="is-danger" icon-left="delete" @click="deleteLesson" style="margin-left: 10px"
        >Delete Lesson</b-button
      >
    </div>
    <div class="tile is-vertical box">
      <div style="display: flex; justify-content: space-between">
        <p class="date grade">
          Grade {{ lesson.grade }} - {{ lesson.subject }}
        </p>
        <div style="display: flex; align-items: center">
          <b-icon
            icon="calendar-month"
            size="mdi-24"
            style="margin-right: 10px; color: grey; margin-top: 4px"
          >
          </b-icon>
          <p class="date grade">
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
      <div style="display: flex; align-items: center; margin-top: 20px">
        <b-icon
          icon="account"
          size="mdi-24"
          style="margin-right: 5px; color: grey"
        >
        </b-icon>
        <h3 class="author">{{ lesson.author }}</h3>
      </div>
      <hr />
      <div>
        <h3>Lesson Description</h3>
        <div class="description box" v-html="lesson.description"></div>
      </div>
      <div v-if="JSON.parse(lesson.files.length > 0)" style="margin-top: 20px">
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
  methods: {
    editLesson(uuid) {
      // Redirect to edit lesson page
      this.$router.push({
        name: "Edit Lesson",
        params: {
          uuid: uuid,
        },
      });
    },
    deleteLesson() {
      this.$buefy.dialog.confirm({
        title: "Deleting lesson",
        message:
          "Are you sure you want to <b>delete</b> this lesson? This action cannot be undone.",
        confirmText: "Delete Lesson",
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          // Delete lesson
          axios
            .delete(`lessons/${this.lesson.uuid}/delete`)
            .then(async (response) => {
              this.$router.push({
                name: "Lessons"
              });

              this.$buefy.toast.open({
                duration: 2000,
                message: response.data.title,
                type: "is-success",
              });
            })
            .catch((error) => {
              // Error Toast
              this.$buefy.toast.open({
                duration: 2000,
                message: error.response.data.title,
                type: "is-danger",
              });
            });
        },
      });
    },
  },
};
</script>

<style scoped>
.date {
  margin: 0px !important;
  /* padding: 0px !important; */
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
