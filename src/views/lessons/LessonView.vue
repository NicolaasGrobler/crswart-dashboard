<template>
  <section class="container">
    <div
      class="tile box"
      v-if="
        $store.state.user.uuid == lesson.author_uuid ||
        $store.state.user.roles.includes('admin')
      "
    >
      <!-- Back -->
      <b-button
        class="button is-primary"
        @click="
          $router.push(`/lessons/subjects/${lesson.grade}/${lesson.subject}`)
        "
        icon-left="arrow-left"
        >Grade {{ lesson.grade }} - {{ lesson.subject }} lessons</b-button
      >
      <!-- Edit -->
      <b-button
        class="is-primary"
        icon-left="pencil"
        @click="editLesson(lesson.uuid)"
        style="margin-left: 10px"
        >Edit Lesson</b-button
      >
      <!-- Delete -->
      <b-button
        class="is-danger"
        icon-left="delete"
        outlined
        @click="deleteLesson"
        style="margin-left: 10px"
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
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
        "
      >
        <div>
          <h3 style="margin: 0px">{{ lesson.title }}</h3>
        </div>
        <div style="display: flex; align-items: center">
          <h3 class="author">{{ lesson.author }}</h3>
          <div
            v-if="author_picture.length > 0"
            class="avatar"
            :style="{
              'background-image': 'url(' + author_picture + ')',
            }"
          ></div>
          <b-icon
            v-else
            icon="account"
            size="mdi-24"
            style="margin-left: 5px; color: grey"
          >
          </b-icon>
        </div>
      </div>
      <hr />
      <div>
        <h4>Lesson Description</h4>
        <div class="description box" v-html="lesson.description"></div>
      </div>
      <div v-if="JSON.parse(lesson.files.length > 0)" style="margin-top: 20px">
        <h4>Files</h4>
        <div class="box">
          <div
            class="file file_button"
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
      lesson: {
        uuid: "",
        title: "",
        description: "",
        files: "",
        grade: "",
      },
      author_picture: "",
    };
  },
  mounted() {
    axios
      .get(`lessons/${this.$route.params.uuid}`)
      .then((response) => {
        this.lesson = response.data.lesson;

        axios
          .get(`auth/profile/picture/${response.data.lesson.author_uuid}`)
          .then((response) => {
            this.author_picture = response.data.picture;
          })
          .catch(() => {
            this.author_picture = "";
          });
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
                name: "Lessons",
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

<style>
.description h3:last-child {
  margin: 0px !important;
}
</style>

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

.file_button {
  margin-bottom: 10px;
}

.file_button:last-child {
  margin-bottom: 0px;
}

.avatar {
  border-radius: 50%;
  border: 2px solid rgb(235, 235, 235);
  margin-left: 10px;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #b89c6a;
  color: white;
  background-size: cover;
  background-position: center;
}
</style>
