<template>
  <section class="container">
    <div class="tile is-vertical box" v-if="!lesson_created">
      <h1>Create Lesson</h1>
      <b-field label="Author">
        <b-input
          icon="account"
          :value="`${$store.state.user.title} ${$store.state.user.surname}`"
          readonly
        ></b-input>
      </b-field>
      <b-field label="Date">
        <b-input
          icon="calendar-range"
          :value="`${new Date().toLocaleDateString('en-GB')}`"
          readonly
        ></b-input>
      </b-field>
      <b-field label="Grade">
        <b-select
          placeholder="Select a grade"
          expanded
          v-model="grade"
          @input="gradeChanged"
        >
          <option
            v-for="grade in [8, 9, 10, 11, 12]"
            :value="grade"
            :key="grade"
          >
            Grade {{ grade }}
          </option>
        </b-select>
      </b-field>
      <b-field label="Subject">
        <b-select
          placeholder="Select a subject"
          expanded
          v-model="subject"
          :disabled="subject_disabled"
          :loading="subject_loading"
        >
          <option
            v-for="subject in subjects"
            :value="subject.name"
            :key="subject.id"
          >
            {{ subject.name }}
          </option>
        </b-select>
      </b-field>
      <!-- Title -->
      <b-field label="Lesson Title">
        <b-input v-model="title"></b-input>
      </b-field>
      <!-- Description -->
      <b-field label="Lesson Description">
        <Tiptap v-model="description"></Tiptap>
      </b-field>
      <!-- File Upload -->
      <b-field label="Files">
        <b-upload
          v-model="files"
          multiple
          drag-drop
          expanded
          :accept="$store.state.user.upload_restrictions"
        >
          <section class="section">
            <div class="content has-text-centered">
              <p>
                <b-icon icon="upload" size="is-large"> </b-icon>
              </p>
              <p>Drop your files here or click to upload</p>
            </div>
          </section>
        </b-upload>
      </b-field>

      <div class="tags">
        <span
          v-for="(file, index) in files"
          :key="index"
          class="tag is-primary is-medium"
        >
          {{ file.name }}
          <button
            class="delete is-small"
            type="button"
            @click="deleteFiles(index)"
          ></button>
        </span>
      </div>
      <!-- Create -->
      <b-button expanded type="is-primary" @click="createLesson"
        >Create Lesson</b-button
      >
    </div>

    <div class="tile is-vertical box" v-else>
      <h1>Lesson Created</h1>
      <b-button
        expanded
        type="is-primary"
        @click="goToLesson"
        style="margin-bottom: 20px"
        outlined
        tag="router-link"
        :to="`/lessons/${new_lesson_uuid}`"
        >Go to Lesson</b-button
      >
      <b-button expanded type="is-primary" @click="reset">
        Create a new lesson
      </b-button>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import Tiptap from "../../components/Tiptap.vue";

export default {
  components: { Tiptap },
  name: "Create",
  title: "CR Swart Lesson Creator",
  data() {
    return {
      grade: null,
      subject: null,
      subjects: [],
      subject_disabled: true,
      subject_loading: false,
      description: null,
      title: null,
      files: [],
      lesson_created: false,
      new_lesson_uuid: null,
    };
  },
  methods: {
    async gradeChanged() {
      // Set Loading State to true
      this.subject_loading = true;

      // Get Subjects for the selected grade
      await this.getSubjects();

      // Set Loading State to false
      this.subject_loading = false;
      // Enable the subject select
      this.subject_disabled = false;
    },
    async createLesson() {
      if (this.files.length === 0) {
        this.$buefy.toast.open({
          duration: 2000,
          message: `No files were selected!`,
          type: "is-danger",
        });
        return;
      }

      // Open the loading indicator
      const loadingComponent = this.$buefy.loading.open({
        container: null,
      });

      // Set up variabled to track files that failed to upload
      let failedFiles = [];
      let failed = false;

      // Variable to keep track of the file data
      let files_data = [];

      // Loop through each file
      for (let i = 0; i < this.files.length; i++) {
        // Get signed s3 url for file upload
        let { url } = await axios
          // TODO: Change the url to the correct to a secure one
          .post("/lessons/s3URL", {
            file_name: this.files[i].name,
            file_type: this.files[i].type,
            file_extension: this.files[i].name.split(".").pop(),
          })
          .then((response) => {
            return response.data;
          });

        let axioInstance = axios.create();
        delete axioInstance.defaults.headers.common["Authorization"];

        // Upload file to s3 bucket
        await axioInstance
          .put(url, this.files[i], {
            headers: {
              "Content-Type": this.files[i].type,
            },
          })
          .then((response) => {
            if (response.status !== 200) {
              failed = true;
              failedFiles.push(this.files[i].name);
            } else {
              files_data.push({
                file_name: this.files[i].name,
                file_url: url.split("?")[0],
                file_type: this.files[i].type,
                file_extension: this.files[i].name.split(".").pop(),
              });
            }
          });
      }

      // Close the loading indicator
      loadingComponent.close();

      // Check if any files failed to upload
      if (failed) {
        this.$buefy.toast.open({
          duration: 5000,
          message: `The following files failed to upload: ${failedFiles.join(
            ", "
          )}`,
          type: "is-danger",
        });
      } else {
        axios
          .post("/lessons/create", {
            author: `${this.$store.state.user.title} ${this.$store.state.user.surname}`,
            date: new Date(),
            grade: this.grade,
            title: this.title,
            subject: this.subject,
            description: this.description,
            files: files_data,
          })
          .then((response) => {
            this.$buefy.toast.open({
              duration: 2000,
              message: response.data.title,
              type: "is-success",
            });

            // Reset the form
            this.grade = null;
            this.subject = null;
            this.description = null;
            this.files = [];

            this.lesson_created = true;
            this.new_lesson_uuid = response.data.lesson.uuid;
          });
      }
    },
    deleteFiles(index) {
      this.files.splice(index, 1);
    },
    getSubjects() {
      axios
        .get(`subjects/grade/${this.grade}`)
        .then((response) => {
          console.log(response.data);
          this.subjects = response.data.subjects;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    reset() {
      this.grade = null;
      this.subject = null;
      this.description = null;
      this.files = [];
      this.lesson_created = false;
    },
  },
};
</script>

<style></style>
