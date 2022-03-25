<template>
  <section class="container">
    <div class="tile is-vertical box" style="position: relative" v-if="!lesson_edited">
      <b-loading :is-full-page="false" v-model="isLoading"></b-loading>

      <h1>Edit Lesson</h1>
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
          :value="`${new Date(this.date).toLocaleDateString('en-GB')}`"
          readonly
        ></b-input>
      </b-field>
      <b-field label="Grade" :type="errors.grade ? 'is-danger':''">
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
      <b-field label="Subject" :type="errors.subject && !subject_disabled ? 'is-danger':''">
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
      <b-field label="Lesson Title" :type="errors.title ? 'is-danger':''">
        <b-input v-model="title"></b-input>
      </b-field>
      <!-- Description -->
      <b-field label="Lesson Description">
        <Tiptap v-model="description" :error="errors.description"></Tiptap>
      </b-field>
      <!-- Uploaded Files -->
      <b-field label="Uploaded Files">
        <b-taginput
          v-model="uploadedFiles"
          ellipsis
          readonly
          ref="uploadedLessonsInput"
          aria-close-label="Delete this tag"
        >
          <template #selected="props">
            <b-tag
              v-for="(tag, index) in props.tags"
              :key="index"
              :tabstop="false"
              ellipsis
              closable
              @close="$refs.uploadedLessonsInput.removeTag(index, $event)"
            >
              {{ tag.file_name }}
            </b-tag>
          </template>
        </b-taginput>
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
      <!-- Save -->
      <b-button expanded type="is-primary" @click="editLesson"
        >Save Lesson</b-button
      >
    </div>

    <div class="tile is-vertical box" v-else>
      <h1>Lesson Updated</h1>
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
        Edit Lesson Again
      </b-button>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import Tiptap from "../../components/Tiptap.vue";

export default {
  components: { Tiptap },
  name: "Edit",
  title: "CR Swart Lesson Editor",
  data() {
    return {
      date: "",
      grade: null,
      subject: null,
      subjects: [],
      subject_disabled: true,
      subject_loading: false,
      title: "",
      description: null,
      uploadedFiles: [],
      files: [],
      lesson_edited: false,
      new_lesson_uuid: null,
      errors: {
        grade: false,
        subject: false,
        title: false,
        description: false,
      },
      isLoading: true
    };
  },
  mounted() {
    this.getLessonData();
  },
  methods: {
    async getLessonData() {
      let response;
      await axios.get(`/lessons/${this.$route.params.uuid}`).then(res => {
        setTimeout(() => {
          this.isLoading = false;
          response = res;
        }, 300);
      });
      console.log(response.data);
      console.log(JSON.parse(response.data.lesson.files));
      this.grade = response.data.lesson.grade;
      this.getSubjects();
      this.subject = response.data.lesson.subject;
      this.date = response.data.lesson.date;
      this.subject_disabled = false;
      this.title = response.data.lesson.title;
      this.description = response.data.lesson.description;
      this.uploadedFiles = JSON.parse(response.data.lesson.files);
    },
    async gradeChanged() {
      this.subject = null;
      
      // Set Loading State to true
      this.subject_loading = true;
      // Enable the subject select
      this.subject_disabled = true;

      // Get Subjects for the selected grade
      await this.getSubjects();

      setTimeout(() => {
        // Set Loading State to false
        this.subject_loading = false;
        // Enable the subject select
        this.subject_disabled = false;
      }, 300);
    },
    async editLesson() {
      this.clearErrors();
      
      let errors = [];

      if (!this.grade) {
        errors.push("grade");
      }

      if (!this.subject && !this.subject_disabled) {
        errors.push("subject");
      }

      if (this.title == "" || this.title == null) {
        errors.push("title");
      }

      console.log(this.description)

      if (this.description == "" || this.description == null || this.description == '<p></p>') {
        errors.push("description");
      }

      if (errors.length > 0) {
        errors.forEach((e) => {
          this.errors[e] = true;
        });

        this.$buefy.toast.open({
          duration: 2000,
          message: "Please make sure to fill in all the fields",
          type: "is-danger",
        });
        return;
      }

      if (this.files.length === 0 && this.uploadedFiles.length === 0) {
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

      // Check if any files failed to upload
      if (failed) {
        this.$buefy.toast.open({
          duration: 5000,
          message: `The following files failed to upload: ${failedFiles.join(
            ", "
          )}`,
          type: "is-danger",
        });

        loadingComponent.close();
      } else {
        files_data = files_data.concat(this.uploadedFiles);

        await axios
          .post(`/lessons/edit/${this.$route.params.uuid}`, {
            author: `${this.$store.state.user.title} ${this.$store.state.user.surname}`,
            grade: this.grade,
            subject: this.subject,
            title: this.title,
            description: this.description,
            files: files_data,
            updated_on: new Date(),
            uuid: this.$route.params.uuid,
          })
          .then((response) => {
            setTimeout(() => {
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

              this.lesson_edited = true;
              this.new_lesson_uuid = response.data.lesson.uuid;
              loadingComponent.close();
            }, 300);
          });
      }
    },
    deleteFiles(index) {
      this.files.splice(index, 1);
    },
    async getSubjects() {
      await axios
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
      this.$router.go(this.$router.currentRoute);
    },
    clearErrors() {
      this.errors = {
        grade: false,
        subject: false,
        title: false,
        description: false,
      };
    },
  },
};
</script>

<style>
.tag {
  cursor: pointer;
}
</style>
