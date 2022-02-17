<template>
  <section class="container">
    <div class="tile box">
      <b-field
        label="Grade Filter"
        message="Leave blank to show lessons from all grades"
      >
        <b-checkbox-button
          v-model="gradeFilter"
          native-value="8"
          @input="getSubjectFilter(8)"
        >
          Grade 8
        </b-checkbox-button>

        <b-checkbox-button
          v-model="gradeFilter"
          native-value="9"
          @input="getSubjectFilter(9)"
        >
          Grade 9
        </b-checkbox-button>

        <b-checkbox-button
          v-model="gradeFilter"
          native-value="10"
          @input="getSubjectFilter(10)"
        >
          Grade 10
        </b-checkbox-button>

        <b-checkbox-button
          v-model="gradeFilter"
          native-value="11"
          @input="getSubjectFilter(11)"
        >
          Grade 11
        </b-checkbox-button>

        <b-checkbox-button
          v-model="gradeFilter"
          native-value="12"
          @input="getSubjectFilter(12)"
        >
          Grade 12
        </b-checkbox-button>
      </b-field>
    </div>

    <div class="tile box" style="padding: 10px" v-show="showSubjectFilter">
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

    <div class="tile is-vertical box">
      <h3>
        Lessons by {{ this.$store.state.user.name }}
        {{ this.$store.state.user.surname }}
      </h3>

      <hr />

      <div
        class="box lesson_box"
        @click="openLessonModal(lesson)"
        v-for="(lesson, index) of lessons.filter((lesson) => {
          if (gradeFilter.length > 0) {
            if (subjectFilter.length > 0) {
              return (
                gradeFilter.includes(lesson.grade) &&
                subjectFilter.includes(lesson.subject)
              );
            } else {
              return gradeFilter.includes(lesson.grade);
            }
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
            if (gradeFilter.length > 0) {
              return gradeFilter.includes(lesson.grade);
            } else {
              return true;
            }
          }).length == 0
        "
      >
        <h4>No lessons found</h4>
      </div>
    </div>

    <!-- Lesson Modal -->
    <b-modal
      v-model="is_lesson_modal_active"
      :width="640"
      scroll="keep"
      :can-cancel="!is_lesson_modal_loading"
    >
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title" style="margin-bottom: 0px">
            Grade {{ lesson.grade }} - {{ lesson.subject }}
          </p>
          <button
            class="delete"
            aria-label="close"
            @click="closeLessonModal"
          ></button>
        </header>
        <section class="modal-card-body">
          <div>
            <h3>Lesson Description</h3>
            <div class="description box" v-html="lesson.description"></div>
          </div>

          <div style="margin-top: 20px">
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
        </section>
        <footer class="modal-card-foot">
          <b-button
            label="Close"
            @click="closeLessonModal"
            :disabled="is_lesson_modal_loading"
          />
          <b-button
            label="Edit Lesson"
            type="is-primary"
            icon-left="pencil"
            :loading="is_lesson_modal_loading"
            @click="editLesson(lesson.uuid)"
          />
          <b-button
            label="Delete Lesson"
            icon-left="delete"
            type="is-danger"
            :loading="is_lesson_modal_loading"
            @click="deleteLesson"
          />
        </footer>
      </div>
    </b-modal>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "MyLessons",
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
      gradeFilter: [],
      subjectFilter: [],
      showSubjectFilter: false,
      subjects: [],
      is_lesson_modal_loading: false,
      is_lesson_modal_active: false,
    };
  },
  mounted() {
    this.getLessons();
  },
  methods: {
    async getLessons() {
      // Get all lessons created by current user
      await axios
        .get(`lessons/author/current`)
        .then((response) => {
          this.lessons = response.data.lessons;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    openLessonModal(lesson) {
      // Set lesson data
      this.lesson = lesson;

      // Open lesson modal
      this.is_lesson_modal_active = true;
    },
    closeLessonModal() {
      // Check if the modal is loading
      if (this.is_lesson_modal_loading) return;

      // Close lesson modal
      this.is_lesson_modal_active = false;

      // Reset lesson
      this.lesson = {
        id: "",
        uuid: "",
        subject: "",
        grade: "",
        date: "",
        author: "",
        files: "[]",
      };
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
          // Delete user
          axios
            .delete(`lessons/${this.lesson.uuid}/delete`)
            .then(async (response) => {
              await this.getLessons();
              this.closeLessonModal();

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
    editLesson(uuid) {
      // Redirect to edit lesson page
      this.$router.push({
        name: "Edit Lesson",
        params: {
          uuid: uuid,
        },
      });
    },
    async getSubjectFilter(grade) {
      if (this.gradeFilter.length == 0 || this.gradeFilter.length > 1) {
        this.showSubjectFilter = false;
      } else {
        // Get subjects for grade
        await axios
          .get(`subjects/grade/${grade}`)
          .then((response) => {
            this.subjects = response.data.subjects;
            this.showSubjectFilter = true;
          })
          .catch((error) => {
            console.log(error);
          });
      }
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
