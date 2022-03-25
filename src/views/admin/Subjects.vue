<template>
  <section class="container" style="padding: 20px">
    <div class="tile is-ancestor box" style="margin-bottom: 30px">
      <!-- Add subject -->
      <b-button icon-left="plus" type="is-primary" @click="openCreateModal">
        Add Subject
      </b-button>
      <!-- Edit subject -->
      <b-button
        icon-left="pencil"
        type="is-primary is-light"
        style="color: white; margin-left: 10px"
        :disabled="is_edit_modal_disabled"
        @click="openEditModal"
      >
        Edit Subject
      </b-button>
      <!-- Delete subject -->
      <b-button
        icon-left="delete"
        type="is-danger"
        style="margin-left: 10px"
        :disabled="checked_rows.length == 0"
        :loading="loading.delete"
        @click="deleteSubject"
      >
        {{ checked_rows.length > 1 ? "Delete Subjects" : "Delete Subject" }}
      </b-button>
    </div>
    <div class="tile is-vertical is-ancestor box">
      <b-field>
        <b-input
          placeholder="Search..."
          type="search"
          icon="magnify"
          v-model="search_term"
        >
        </b-input>
        <p class="control">
          <b-button type="is-primary" label="Search" />
        </p>
      </b-field>

      <b-table
        :data="
          data.filter((subject) =>
            subject.name.toLowerCase().includes(search_term.toLowerCase())
          )
        "
        style="width: 100%"
        striped
        checkable
        :loading="isLoading"
        :checked-rows.sync="checked_rows"
      >
        <b-table-column field="name" label="Name" v-slot="props">
          {{ props.row.name }}
        </b-table-column>

        <b-table-column
          field="grade_8"
          label="Grade 8"
          v-slot="props"
          centered
          width="100"
        >
          <b-checkbox v-model="props.row.grade_8"></b-checkbox>
        </b-table-column>
        <b-table-column
          field="grade_9"
          label="Grade 9"
          v-slot="props"
          centered
          width="100"
        >
          <b-checkbox v-model="props.row.grade_9"></b-checkbox>
        </b-table-column>
        <b-table-column
          field="grade_10"
          label="Grade 10"
          v-slot="props"
          centered
          width="100"
        >
          <b-checkbox v-model="props.row.grade_10"></b-checkbox>
        </b-table-column>
        <b-table-column
          field="grade_11"
          label="Grade 11"
          v-slot="props"
          centered
          width="100"
        >
          <b-checkbox v-model="props.row.grade_11"></b-checkbox>
        </b-table-column>
        <b-table-column
          field="grade_12"
          label="Grade 12"
          v-slot="props"
          centered
          width="100"
        >
          <b-checkbox v-model="props.row.grade_12"></b-checkbox>
        </b-table-column>

        <template #empty>
          <div class="has-text-centered" v-if="!isLoading">No records</div>
        </template>
      </b-table>
    </div>
    <div class="tile is-ancestor box" style="margin-top: 20px">
      <b-button
        icon-left="content-save-check"
        type="is-primary"
        @click="saveSubjects"
        :disabled="isLoading"
        :loading="loading.save_all"
        >Save Subject Grades</b-button
      >
    </div>

    <!-- Create Subject Modal -->
    <b-modal
      v-model="is_create_modal_active"
      :width="640"
      scroll="keep"
      :can-cancel="!is_modal_create_loading"
    >
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title" style="margin-bottom: 0px">
            Create Subject
          </p>
          <button
            class="delete"
            aria-label="close"
            @click="closeCreateModal"
          ></button>
        </header>
        <section class="modal-card-body">
          <b-field
            label="Subject Name"
            :type="errors.create.name ? 'is-danger' : ''"
          >
            <b-input
              v-model="new_subject.name"
              placeholder="Enter subject name"
              :disabled="is_modal_create_loading"
            ></b-input>
          </b-field>
          <b-field label="Grades">
            <div class="block">
              <b-checkbox
                v-model="new_subject.grade_8"
                native-value="Grade 8"
                style="margin-right: 20px"
                :disabled="is_modal_create_loading"
              >
                8
              </b-checkbox>
              <b-checkbox
                v-model="new_subject.grade_9"
                native-value="9"
                style="margin-right: 20px"
                :disabled="is_modal_create_loading"
              >
                9
              </b-checkbox>
              <b-checkbox
                v-model="new_subject.grade_10"
                native-value="10"
                style="margin-right: 20px"
                :disabled="is_modal_create_loading"
              >
                10
              </b-checkbox>
              <b-checkbox
                v-model="new_subject.grade_11"
                native-value="11"
                style="margin-right: 20px"
                :disabled="is_modal_create_loading"
              >
                11
              </b-checkbox>
              <b-checkbox
                v-model="new_subject.grade_12"
                native-value="12"
                style="margin-right: 20px"
                :disabled="is_modal_create_loading"
              >
                12
              </b-checkbox>
            </div>
          </b-field>
          <transition name="fade" mode="out-in">
            <p
              v-show="errors.create.grades"
              style="color: #640b26; font-weight: bold"
            >
              Please select a grade
            </p>
          </transition>
        </section>
        <footer class="modal-card-foot">
          <b-button
            label="Close"
            @click="closeCreateModal"
            :disabled="is_modal_create_loading"
          />
          <b-button
            label="Create Subject"
            type="is-primary"
            @click="createSubject"
            :loading="is_modal_create_loading"
          />
        </footer>
      </div>
    </b-modal>

    <!-- Edit Subject Modal -->
    <b-modal
      v-model="is_edit_modal_active"
      :width="640"
      scroll="keep"
      :can-cancel="!is_modal_edit_loading"
    >
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title" style="margin-bottom: 0px">
            Edit Subject
          </p>
          <button
            class="delete"
            aria-label="close"
            @click="closeEditModal"
          ></button>
        </header>
        <section class="modal-card-body">
          <b-field
            label="Subject Name"
            :type="errors.edit.name ? 'is-danger' : ''"
          >
            <b-input
              v-model="new_subject.name"
              placeholder="Enter subject name"
              :disabled="is_modal_edit_loading"
            ></b-input>
          </b-field>
          <b-field label="Grades">
            <div class="block">
              <b-checkbox
                v-model="new_subject.grade_8"
                native-value="Grade 8"
                style="margin-right: 20px"
                :disabled="is_modal_edit_loading"
              >
                8
              </b-checkbox>
              <b-checkbox
                v-model="new_subject.grade_9"
                native-value="9"
                style="margin-right: 20px"
                :disabled="is_modal_edit_loading"
              >
                9
              </b-checkbox>
              <b-checkbox
                v-model="new_subject.grade_10"
                native-value="10"
                style="margin-right: 20px"
                :disabled="is_modal_edit_loading"
              >
                10
              </b-checkbox>
              <b-checkbox
                v-model="new_subject.grade_11"
                native-value="11"
                style="margin-right: 20px"
                :disabled="is_modal_edit_loading"
              >
                11
              </b-checkbox>
              <b-checkbox
                v-model="new_subject.grade_12"
                native-value="12"
                style="margin-right: 20px"
                :disabled="is_modal_edit_loading"
              >
                12
              </b-checkbox>
            </div>
          </b-field>
          <transition name="fade" mode="out-in">
            <p
              v-show="errors.edit.grades"
              style="color: #640b26; font-weight: bold"
            >
              Please select a grade
            </p>
          </transition>
        </section>
        <footer class="modal-card-foot">
          <b-button
            label="Close"
            @click="closeEditModal"
            :disabled="is_modal_edit_loading"
          />
          <b-button
            label="Save Changes"
            type="is-primary"
            @click="editSubject"
            :loading="is_modal_edit_loading"
          />
        </footer>
      </div>
    </b-modal>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "Subjects",
  title: "CR Swart Subjects",
  data() {
    return {
      data: [],
      checked_rows: [],
      is_create_modal_active: false,
      is_modal_create_loading: false,
      is_edit_modal_active: false,
      is_modal_edit_loading: false,
      is_edit_modal_disabled: true,
      search_term: "",
      new_subject: {
        name: "",
        grade_8: false,
        grade_9: false,
        grade_10: false,
        grade_11: false,
        grade_12: false,
      },
      isLoading: true,
      loading: {
        save_all: false,
        delete: false,
      },
      errors: {
        create: {
          name: false,
          grades: false,
        },
        edit: {
          name: false,
          grades: false,
        },
      },
    };
  },
  watch: {
    checked_rows() {
      console.log(this.checked_rows.length);
      if (this.checked_rows.length === 1) {
        this.is_edit_modal_disabled = false;
      } else {
        this.is_edit_modal_disabled = true;
      }
    },
  },
  async mounted() {
    await this.getSubjects();
  },
  methods: {
    closeCreateModal() {
      // Check if the modal is in a loading state
      if (this.is_modal_create_loading) {
        return;
      }

      // Hide the modal
      this.is_create_modal_active = false;

      // Reset new_subject
      this.new_subject = {
        name: "",
        grade_8: false,
        grade_9: false,
        grade_10: false,
        grade_11: false,
        grade_12: false,
      };
    },
    closeEditModal() {
      // Check if the modal is in a loading state
      if (this.is_modal_edit_loading) {
        return;
      }

      // Hide the modal
      this.is_edit_modal_active = false;

      // Reset new_subject
      this.new_subject = {
        name: "",
        grade_8: false,
        grade_9: false,
        grade_10: false,
        grade_11: false,
        grade_12: false,
      };
    },
    createSubject() {
      this.clearErrors();

      let errors = [];

      if (this.new_subject.name === "") {
        errors.push("name");
      }

      // if (
      //   this.new_subject.grade_8 === false &&
      //   this.new_subject.grade_9 === false &&
      //   this.new_subject.grade_10 === false &&
      //   this.new_subject.grade_11 === false &&
      //   this.new_subject.grade_12 === false
      // ) {
      //   errors.push("grades");
      // }

      if (errors.length > 0) {
        errors.forEach((e) => {
          this.errors.create[e] = true;
        });

        this.$buefy.toast.open({
          duration: 2000,
          message: "Please make sure to fill in all the fields",
          type: "is-danger",
        });
        return;
      }

      this.is_modal_create_loading = true;

      // Create the new subject
      axios
        .post("/subjects/create", this.new_subject)
        .then(() => {
          setTimeout(() => {
            this.is_modal_create_loading = false;
            this.is_create_modal_active = false;
            this.new_subject = {
              name: "",
              grade_8: false,
              grade_9: false,
              grade_10: false,
              grade_11: false,
              grade_12: false,
            };
            this.getSubjects();
            this.$buefy.toast.open({
              message: "Subject created successfully",
              duration: 2000,
              type: "is-success",
            });
          }, 300);
        })
        .catch((error) => {
          setTimeout(() => {
            console.log(error);
            this.is_modal_create_loading = false;
            this.$buefy.toast.open({
              message: "Error creating subject",
              duration: 2000,
              type: "is-danger",
            });
          }, 300);
        });
    },
    openCreateModal() {
      this.clearErrors();
      this.is_create_modal_active = true;
    },
    openEditModal() {
      this.clearErrors();

      // Set subject data
      this.new_subject = {
        name: this.checked_rows[0].name,
        grade_8: this.checked_rows[0].grade_8,
        grade_9: this.checked_rows[0].grade_9,
        grade_10: this.checked_rows[0].grade_10,
        grade_11: this.checked_rows[0].grade_11,
        grade_12: this.checked_rows[0].grade_12,
      };

      // Show the modal
      this.is_edit_modal_active = true;
    },
    editSubject() {
      this.clearErrors();

      let errors = [];

      if (this.new_subject.name === "") {
        errors.push("name");
      }

      // if (
      //   this.new_subject.grade_8 === false &&
      //   this.new_subject.grade_9 === false &&
      //   this.new_subject.grade_10 === false &&
      //   this.new_subject.grade_11 === false &&
      //   this.new_subject.grade_12 === false
      // ) {
      //   errors.push("grades");
      // }

      if (errors.length > 0) {
        errors.forEach((e) => {
          this.errors.edit[e] = true;
        });

        this.$buefy.toast.open({
          duration: 2000,
          message: "Please make sure to fill in all the fields",
          type: "is-danger",
        });
        return;
      }

      this.is_modal_edit_loading = true;

      // Update the subject
      axios
        .put("subjects/update", {
          id: this.checked_rows[0].id,
          ...this.new_subject,
        })
        .then(async (response) => {
          setTimeout(async () => {
            this.is_modal_edit_loading = false;
            this.is_edit_modal_active = false;
            this.new_subject = {
              name: "",
              grade_8: false,
              grade_9: false,
              grade_10: false,
              grade_11: false,
              grade_12: false,
            };
            this.getSubjects();
            this.$buefy.toast.open({
              message: response.data.title,
              duration: 2000,
              type: "is-success",
            });

            this.checked_rows = [];
            await this.getSubjects();
          }, 300);
        })
        .catch((error) => {
          setTimeout(() => {
            console.log(error);
            this.is_modal_edit_loading = false;
            this.$buefy.toast.open({
              message: "Error updating subject",
              duration: 2000,
              type: "is-danger",
            });
          }, 300);
        });
    },
    deleteSubject() {
      this.$buefy.dialog.confirm({
        title: "Deleting subject",
        message:
          "Are you sure you want to <b>delete</b> this subject? This action cannot be undone.",
        confirmText: "Delete Subject",
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          this.loading.delete = true;

          axios
            .delete("subjects/delete", {
              data: {
                subjects: this.checked_rows,
              },
            })
            .then((response) => {
              setTimeout(() => {
                this.getSubjects();
                this.$buefy.toast.open({
                  message: response.data.title,
                  duration: 2000,
                  type: "is-success",
                });
                this.checked_rows = [];
                this.loading.delete = false;
              }, 300);
            })
            .catch((error) => {
              setTimeout(() => {
                this.$buefy.toast.open({
                  message: error.response.data.title,
                  duration: 2000,
                  type: "is-danger",
                });
                this.loading.delete = false;
              }, 300);
            });
        },
      });
    },
    saveSubjects() {
      this.loading.save_all = true;

      axios
        .put("/subjects/update/multiple", {
          subjects: this.data,
        })
        .then((response) => {
          setTimeout(() => {
            this.loading.save_all = false;
            this.$buefy.toast.open({
              message: response.data.title,
              duration: 2000,
              type: "is-success",
            });
          }, 300);
        })
        .catch((error) => {
          setTimeout(() => {
            this.loading.save_all = false;
            this.$buefy.toast.open({
              message: error.response.data.title,
              duration: 2000,
              type: "is-danger",
            });
          }, 300);
        });
    },
    async getSubjects() {
      await axios
        .get("subjects")
        .then((response) => {
          setTimeout(() => {
            this.isLoading = false;
            this.data = response.data.subjects;
          }, 300);
        })
        .catch((error) => {
          alert(error);
          this.data = [];
        });
    },
    clearErrors() {
      this.errors = {
        create: {
          name: false,
          grades: false,
        },
        edit: {
          name: false,
          grades: false,
        },
      };
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
}
</style>
