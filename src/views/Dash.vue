<template>
  <div style="height: 100%">
    <section
      v-show="isLoading"
      style="width: 100%; height: 100%; position: relative"
    >
      <b-loading :is-full-page="false" v-model="isLoading"></b-loading>
    </section>
    <transition name="fade" mode="out-in">
      <section class="container" v-show="!isLoading">
        <div v-if="$store.state.user.roles.includes('admin')">
          <h3 style="text-align: center">Total Statistics</h3>
          <!-- Totals by Subject -->
          <div class="tile box is-vertical" v-if="total_lessons > 0">
            <h3>Totals by Subject</h3>
            <div style="display: flex">
              <div
                class="my-block"
                v-for="(subject, index) in all_subject_totals"
                :key="index"
              >
                <p style="font-size: 20px; font-weight: 700; margin: 0px">
                  {{ subject.subject }}
                </p>
                <p
                  style="font-weight: 700; margin-top: 10px"
                  class="my-block-value"
                >
                  {{ subject.occurrence }}
                </p>
              </div>
            </div>
          </div>
          <div class="tile box is-vertical" v-else>
            <h3>Totals by Subject</h3>
            <div style="display: flex">
              <div class="my-block">
                <p style="font-size: 20px; font-weight: 700; margin: 0px">
                  No Lessons Made
                </p>
                <div
                  class="button is-primary"
                  style="margin-top: 5px"
                  @click="$router.push('lessons/create')"
                >
                  <span class="icon">
                    <b-icon icon="book-plus"></b-icon>
                  </span>
                  <span>Create Lesson</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Totals by Grade -->
          <div class="tile box is-vertical" v-if="total_lessons > 0">
            <h3>Totals by Grade</h3>
            <div style="display: flex">
              <b-tooltip
                :label="`View Grade ${grade.grade} Lessons`"
                position="is-bottom"
                style="margin-right: 20px; flex: 1"
                v-for="(grade, index) in all_grade_totals"
                :key="index"
              >
                <div
                  class="my-block interactive"
                  @click="$router.push(`lessons/subjects/${grade.grade}`)"
                >
                  <p style="font-size: 20px; font-weight: 700; margin: 0px">
                    Grade {{ grade.grade }}
                  </p>
                  <p
                    style="font-weight: 700; margin-top: 10px"
                    class="my-block-value"
                  >
                    {{ grade.occurrence }}
                  </p>
                </div>
              </b-tooltip>
            </div>
          </div>
          <div class="tile box is-vertical" v-else>
            <h3>Totals by Grade</h3>
            <div style="display: flex">
              <div class="my-block">
                <p style="font-size: 20px; font-weight: 700; margin: 0px">
                  No Lessons Made
                </p>
                <div
                  class="button is-primary"
                  style="margin-top: 5px"
                  @click="$router.push('lessons/create')"
                >
                  <span class="icon">
                    <b-icon icon="book-plus"></b-icon>
                  </span>
                  <span>Create Lesson</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Users Table -->
          <div class="tile box is-vertical">
            <h3>Teacher Statistics</h3>

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
                usersData.filter((user) =>
                  user.name.toLowerCase().includes(search_term.toLowerCase())
                )
              "
              class="my-block"
              style="width: 100%; display: block; text-align: left"
              striped
            >
              <b-table-column field="name" label="Name" v-slot="props">
                {{ props.row.name }}
              </b-table-column>

              <b-table-column
                field="lastLesson"
                label="Last Lesson On"
                v-slot="props"
              >
                {{ props.row.lastLesson }}
              </b-table-column>

              <b-table-column
                field="total"
                label="Total"
                v-slot="props"
                width="50"
              >
                <div style="text-align: center">{{ props.row.total }}</div>
              </b-table-column>
              <template #empty>
                <div class="has-text-centered">No records</div>
              </template>
            </b-table>
          </div>

          <div class="tile box is-vertical">
            <h3>Latest Lessons</h3>
            <template v-if="latest_lessons_all.length > 0">
              <div
                class="tile box lesson_box"
                @click="ViewLesson(lesson.uuid)"
                v-for="(lesson, index) of latest_lessons_all"
                :key="index"
                style="
                  margin-bottom: 10px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <div>{{ lesson.subject }} - {{ lesson.title }}</div>
                <div style="display: flex">
                  <p
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 0px;
                      margin-right: 10px;
                    "
                  >
                    <b-icon
                      icon="calendar"
                      style="margin-right: 5px; color: #555"
                    >
                    </b-icon>
                    {{ new Date(lesson.date).toLocaleDateString("en-GB") }}
                  </p>
                  <p
                    class="lesson_box_date lesson_box_grade"
                    style="margin-left: 10px !important; background: #640b26"
                    v-if="
                      new Date(lesson.updated_on).toLocaleDateString('en-GB') !=
                      '01/01/1970'
                    "
                  >
                    Updated
                    {{
                      new Date(lesson.updated_on).toLocaleDateString("en-GB")
                    }}
                  </p>
                </div>
              </div>
            </template>
            <div style="display: flex" v-else>
              <div class="my-block">
                <p style="font-size: 20px; font-weight: 700; margin: 0px">
                  No Lessons
                </p>
              </div>
            </div>
          </div>

          <h3 style="text-align: center">Personal Statistics</h3>
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
              <p
                style="font-weight: 700; margin-top: 10px"
                class="my-block-value"
              >
                {{ total_lessons }}
              </p>
            </div>
            <template>
              <template v-if="!lessons_made">
                <b-tooltip
                  label="View Your Lessons"
                  position="is-bottom"
                  style="margin-right: 20px; flex: 1"
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
                        Your Lessons
                      </p>
                    </div>
                    <p
                      style="font-weight: 700; margin-top: 10px"
                      class="my-block-value"
                    >
                      0
                    </p>
                  </div>
                </b-tooltip>
                <div class="my-block" style="margin-right: 0px">
                  <div style="display: flex; align-items: center">
                    <b-icon
                      icon="book-account"
                      size="mdi-24"
                      style="margin-right: 10px"
                    ></b-icon>
                    <p style="font-size: 20px; font-weight: 700; margin: 0px">
                      Your Latest Lesson
                    </p>
                  </div>
                  <p
                    style="font-weight: 700; margin-top: 10px"
                    class="my-block-value"
                  >
                    No Lessons Made
                  </p>
                </div>
              </template>
              <template v-else>
                <b-tooltip
                  label="View Your Lessons"
                  position="is-bottom"
                  style="margin-right: 20px; flex: 1"
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
                        Your Lessons
                      </p>
                    </div>
                    <p
                      style="font-weight: 700; margin-top: 10px"
                      class="my-block-value"
                    >
                      {{ total_made }}
                    </p>
                  </div>
                </b-tooltip>
                <b-tooltip
                  label="View Lesson"
                  position="is-bottom"
                  style="margin-right: 20px; flex: 1"
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
                        Your Latest Lesson
                      </p>
                    </div>
                    <p
                      style="font-weight: 700; margin-top: 10px"
                      class="my-block-value"
                    >
                      Grade {{ latest_lesson.grade }} -
                      {{ latest_lesson.subject }}
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
                  <p
                    style="font-weight: 700; margin-top: 10px"
                    class="my-block-value"
                  >
                    {{ new Date(latest_lesson.date).toLocaleString("en-GB") }}
                  </p>
                </div>
              </template>
            </template>
          </div>
          <!-- Totals by Subject -->
          <div class="tile box is-vertical" v-if="lessons_made">
            <h3>Your Totals by Subject</h3>
            <div style="display: flex">
              <div
                class="my-block"
                v-for="(subject, index) in subject_totals"
                :key="index"
              >
                <p style="font-size: 20px; font-weight: 700; margin: 0px">
                  {{ subject.subject }}
                </p>
                <p
                  style="font-weight: 700; margin-top: 10px"
                  class="my-block-value"
                >
                  {{ subject.occurrence }}
                </p>
              </div>
            </div>
          </div>
          <div class="tile box is-vertical" v-else>
            <h3>Your Totals by Subject</h3>
            <div style="display: flex">
              <div class="my-block">
                <p style="font-size: 20px; font-weight: 700; margin: 0px">
                  No Lessons Made
                </p>
                <div
                  class="button is-primary"
                  style="margin-top: 5px"
                  @click="$router.push('lessons/create')"
                >
                  <span class="icon">
                    <b-icon icon="book-plus"></b-icon>
                  </span>
                  <span>Create Lesson</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Totals by Grade -->
          <div class="tile box is-vertical" v-if="lessons_made">
            <h3>Your Totals by Grade</h3>
            <div style="display: flex">
              <div
                class="my-block"
                v-for="(grade, index) in grade_totals"
                :key="index"
              >
                <p style="font-size: 20px; font-weight: 700; margin: 0px">
                  Grade {{ grade.grade }}
                </p>
                <p
                  style="font-weight: 700; margin-top: 10px"
                  class="my-block-value"
                >
                  {{ grade.occurrence }}
                </p>
              </div>
            </div>
          </div>
          <div class="tile box is-vertical" v-else>
            <h3>Your Totals by Grade</h3>
            <div style="display: flex">
              <div class="my-block">
                <p style="font-size: 20px; font-weight: 700; margin: 0px">
                  No Lessons Made
                </p>
                <div
                  class="button is-primary"
                  style="margin-top: 5px"
                  @click="$router.push('lessons/create')"
                >
                  <span class="icon">
                    <b-icon icon="book-plus"></b-icon>
                  </span>
                  <span>Create Lesson</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Latest Lesson -->
          <div class="tile box is-vertical">
            <h3>Your Latest Lessons</h3>
            <template v-if="lessons_made">
              <div
                class="tile box lesson_box"
                v-for="(lesson, index) in latest_author_lessons"
                :key="index"
                @click="ViewLesson(lesson.uuid)"
                style="
                  margin-bottom: 10px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <div>{{ lesson.subject }} - {{ lesson.title }}</div>
                <div style="display: flex">
                  <p
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 0px;
                      margin-right: 10px;
                    "
                  >
                    <b-icon
                      icon="calendar"
                      style="margin-right: 5px; color: #555"
                    >
                    </b-icon>
                    {{ new Date(lesson.date).toLocaleDateString("en-GB") }}
                  </p>
                  <p
                    class="lesson_box_date lesson_box_grade"
                    style="margin-left: 10px !important; background: #640b26"
                    v-if="
                      new Date(lesson.updated_on).toLocaleDateString('en-GB') !=
                      '01/01/1970'
                    "
                  >
                    Updated
                    {{
                      new Date(lesson.updated_on).toLocaleDateString("en-GB")
                    }}
                  </p>
                </div>
              </div>
            </template>
            <div style="display: flex" v-else>
              <div class="my-block">
                <p style="font-size: 20px; font-weight: 700; margin: 0px">
                  No Lessons
                </p>
                <div
                  class="button is-primary"
                  style="margin-top: 5px"
                  @click="$router.push('lessons/create')"
                >
                  <span class="icon">
                    <b-icon icon="book-plus"></b-icon>
                  </span>
                  <span>Create Lesson</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="$store.state.user.roles.includes('teacher')">
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
              <p
                style="font-weight: 700; margin-top: 10px"
                class="my-block-value"
              >
                {{ total_lessons }}
              </p>
            </div>
            <template>
              <template v-if="!lessons_made">
                <b-tooltip
                  label="View My Lessons"
                  position="is-bottom"
                  style="margin-right: 20px; flex: 1"
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
                    <p
                      style="font-weight: 700; margin-top: 10px"
                      class="my-block-value"
                    >
                      0
                    </p>
                  </div>
                </b-tooltip>
                <div class="my-block" style="margin-right: 0px">
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
                  <p
                    style="font-weight: 700; margin-top: 10px"
                    class="my-block-value"
                  >
                    No Lessons Made
                  </p>
                </div>
              </template>
              <template v-else>
                <b-tooltip
                  label="View My Lessons"
                  position="is-bottom"
                  style="margin-right: 20px; flex: 1"
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
                    <p
                      style="font-weight: 700; margin-top: 10px"
                      class="my-block-value"
                    >
                      {{ total_made }}
                    </p>
                  </div>
                </b-tooltip>
                <b-tooltip
                  label="View Lesson"
                  position="is-bottom"
                  style="margin-right: 20px; flex: 1"
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
                    <p
                      style="font-weight: 700; margin-top: 10px"
                      class="my-block-value"
                    >
                      Grade {{ latest_lesson.grade }} -
                      {{ latest_lesson.subject }}
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
                  <p
                    style="font-weight: 700; margin-top: 10px"
                    class="my-block-value"
                  >
                    {{ new Date().toLocaleString("en-GB") }}
                  </p>
                </div>
              </template>
            </template>
          </div>
          <!-- Totals by Subject -->
          <div class="tile box is-vertical" v-if="lessons_made">
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
                <p
                  style="font-weight: 700; margin-top: 10px"
                  class="my-block-value"
                >
                  {{ subject.occurrence }}
                </p>
              </div>
            </div>
          </div>
          <div class="tile box is-vertical" v-else>
            <h3>Totals by Subject</h3>
            <div style="display: flex">
              <div class="my-block">
                <p style="font-size: 20px; font-weight: 700; margin: 0px">
                  No Lessons Made
                </p>
                <div
                  class="button is-primary"
                  style="margin-top: 5px"
                  @click="$router.push('lessons/create')"
                >
                  <span class="icon">
                    <b-icon icon="book-plus"></b-icon>
                  </span>
                  <span>Create Lesson</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Totals by Grade -->
          <div class="tile box is-vertical" v-if="lessons_made">
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
                <p
                  style="font-weight: 700; margin-top: 10px"
                  class="my-block-value"
                >
                  {{ grade.occurrence }}
                </p>
              </div>
            </div>
          </div>
          <div class="tile box is-vertical" v-else>
            <h3>Totals by Grade</h3>
            <div style="display: flex">
              <div class="my-block">
                <p style="font-size: 20px; font-weight: 700; margin: 0px">
                  No Lessons Made
                </p>
                <div
                  class="button is-primary"
                  style="margin-top: 5px"
                  @click="$router.push('lessons/create')"
                >
                  <span class="icon">
                    <b-icon icon="book-plus"></b-icon>
                  </span>
                  <span>Create Lesson</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Latest Lesson -->
          <div class="tile box is-vertical">
            <h3>Latest Lessons</h3>
            <template v-if="lessons_made">
              <div
                class="tile box lesson_box"
                @click="ViewLesson(lesson.uuid)"
                v-for="(lesson, index) in latest_author_lessons"
                :key="index"
                style="
                  margin-bottom: 10px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <div>{{ lesson.subject }} - {{ lesson.title }}</div>
                <div style="display: flex">
                  <p
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 0px;
                      margin-right: 10px;
                    "
                  >
                    <b-icon
                      icon="calendar"
                      style="margin-right: 5px; color: #555"
                    >
                    </b-icon>
                    {{ new Date(lesson.date).toLocaleDateString("en-GB") }}
                  </p>
                  <p
                    class="lesson_box_date lesson_box_grade"
                    style="margin-left: 10px !important; background: #640b26"
                    v-if="
                      new Date(lesson.updated_on).toLocaleDateString('en-GB') !=
                      '01/01/1970'
                    "
                  >
                    Updated
                    {{
                      new Date(lesson.updated_on).toLocaleDateString("en-GB")
                    }}
                  </p>
                </div>
              </div>
            </template>
            <div style="display: flex" v-else>
              <div class="my-block">
                <p style="font-size: 20px; font-weight: 700; margin: 0px">
                  No Lessons
                </p>
                <div
                  class="button is-primary"
                  style="margin-top: 5px"
                  @click="$router.push('lessons/create')"
                >
                  <span class="icon">
                    <b-icon icon="book-plus"></b-icon>
                  </span>
                  <span>Create Lesson</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="$store.state.user.roles.includes('student')">
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
              <p
                style="font-weight: 700; margin-top: 10px"
                class="my-block-value"
              >
                {{ total_lessons }}
              </p>
            </div>
            <template>
              <template v-if="!lessons_made">
                <b-tooltip
                  label="View Lessons For You"
                  position="is-bottom"
                  style="margin-right: 20px; flex: 1"
                >
                  <div
                    class="my-block interactive"
                    style="margin-right: 0px"
                    @click="$router.push('lessons/for-me')"
                  >
                    <div style="display: flex; align-items: center">
                      <b-icon
                        icon="book-account"
                        size="mdi-24"
                        style="margin-right: 10px"
                      >
                      </b-icon>
                      <p style="font-size: 20px; font-weight: 700; margin: 0px">
                        Grade {{ $store.state.user.grade }} Lessons
                      </p>
                    </div>
                    <p
                      style="font-weight: 700; margin-top: 10px"
                      class="my-block-value"
                    >
                      0
                    </p>
                  </div>
                </b-tooltip>
                <div class="my-block" style="margin-right: 0px">
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
                  <p
                    style="font-weight: 700; margin-top: 10px"
                    class="my-block-value"
                  >
                    No Lessons
                  </p>
                </div>
              </template>
              <template v-else>
                <b-tooltip
                  label="View Lessons For You"
                  position="is-bottom"
                  style="margin-right: 20px; flex: 1"
                >
                  <div
                    class="my-block interactive"
                    style="margin-right: 0px"
                    @click="$router.push('lessons/for-me')"
                  >
                    <div style="display: flex; align-items: center">
                      <b-icon
                        icon="book-account"
                        size="mdi-24"
                        style="margin-right: 10px"
                      >
                      </b-icon>
                      <p style="font-size: 20px; font-weight: 700; margin: 0px">
                        Grade {{ $store.state.user.grade }} Lessons
                      </p>
                    </div>
                    <p
                      style="font-weight: 700; margin-top: 10px"
                      class="my-block-value"
                    >
                      {{ total_for_grade }}
                    </p>
                  </div>
                </b-tooltip>
                <b-tooltip
                  label="View Lesson"
                  position="is-bottom"
                  style="margin-right: 20px; flex: 1"
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
                    <p
                      style="font-weight: 700; margin-top: 10px"
                      class="my-block-value"
                    >
                      Grade {{ latest_lesson.grade }} -
                      {{ latest_lesson.subject }}
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
                  <p
                    style="font-weight: 700; margin-top: 10px"
                    class="my-block-value"
                  >
                    {{ new Date(latest_lesson.date).toLocaleString("en-GB") }}
                  </p>
                </div>
              </template>
            </template>
          </div>
          <!-- Totals by Subject -->
          <div class="tile box is-vertical" v-if="lessons_made">
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
                <p
                  style="font-weight: 700; margin-top: 10px"
                  class="my-block-value"
                >
                  {{ subject.total }}
                </p>
              </div>
            </div>
          </div>
          <div class="tile box is-vertical" v-else>
            <h3>Totals by Subject</h3>
            <div style="display: flex">
              <div class="my-block">
                <p style="font-size: 20px; font-weight: 700; margin: 0px">
                  No Lessons
                </p>
              </div>
            </div>
          </div>

          <div class="tile box is-vertical">
            <h3>Latest Lessons</h3>
            <template v-if="latest_lessons.length > 0">
              <div
                class="tile box lesson_box"
                @click="ViewLesson(lesson.uuid)"
                v-for="(lesson, index) of latest_lessons"
                :key="index"
                style="
                  margin-bottom: 10px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <div>{{ lesson.subject }} - {{ lesson.title }}</div>
                <div style="display: flex">
                  <p
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 0px;
                      margin-right: 10px;
                    "
                  >
                    <b-icon
                      icon="calendar"
                      style="margin-right: 5px; color: #555"
                    >
                    </b-icon>
                    {{ new Date(lesson.date).toLocaleDateString("en-GB") }}
                  </p>
                  <p
                    class="lesson_box_date lesson_box_grade"
                    style="margin-left: 10px !important; background: #640b26"
                    v-if="
                      new Date(lesson.updated_on).toLocaleDateString('en-GB') !=
                      '01/01/1970'
                    "
                  >
                    Updated
                    {{
                      new Date(lesson.updated_on).toLocaleDateString("en-GB")
                    }}
                  </p>
                </div>
              </div>
            </template>
            <div style="display: flex">
              <div class="my-block">
                <p style="font-size: 20px; font-weight: 700; margin: 0px">
                  No Lessons
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Dash",
  data() {
    return {
      lessons_made: false,
      total_lessons: 0,
      total_made: 0,
      subject_totals: [],
      grade_totals: [],
      total_for_grade: 0,
      latest_lesson: {},
      latest_lessons: [],
      latest_lessons_all: [],
      all_grade_totals: [],
      all_subject_totals: [],
      latest_author_lessons: [],
      search_term: "",
      usersData: [],
      isLoading: true,
    };
  },
  async beforeMount() {
    await this.getTotalLessons();

    if (this.$store.state.user.roles.includes("admin")) {
      await this.getAllGradeTotals();
      await this.getAllSubjectTotals();
      await this.getTeacherData();
      await this.getFiveLatestLessonsAll();
    }

    if (
      this.$store.state.user.roles.includes("teacher") ||
      this.$store.state.user.roles.includes("admin")
    ) {
      await this.getTotalLessonsMade();

      //Check if the user has made any lessons otherwise don't continue to get lesson data
      if (this.total_made == 0) {
        this.lessons_made = false;
      } else {
        this.lessons_made = true;
        await this.getLatestLesson();
        await this.getSubjectTotals();
        await this.getFiveLatestAuthorLessons();
      }
    }

    if (this.$store.state.user.roles.includes("student")) {
      if (this.total_lessons == 0) {
        this.lessons_made = false;
      } else {
        this.lessons_made = true;
        await this.getTotalForGrade();
        await this.getLatestForGrade();
        await this.getTotalForGradeSubjects();
        await this.getFiveLatestLessons();
      }
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 100);
  },
  methods: {
    async getTotalLessons() {
      await axios
        .get("/lessons/")
        .then((response) => {
          this.total_lessons = response.data.lessons.length;
          return response.data.lessons.length;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    },
    async getTotalLessonsMade() {
      await axios
        .get("/lessons/author/current")
        .then((response) => {
          this.total_made = response.data.lessons.length;
          return response.data.lessons.length;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    },
    async getLatestLesson() {
      await axios
        .get("/lessons/author/current/latest")
        .then((response) => {
          return (this.latest_lesson = response.data.lesson[0]);
        })
        .catch((error) => {
          console.log(error);
          return error;
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
    async getSubjectTotals() {
      await axios
        .get(`lessons/author/current/totals`)
        .then((response) => {
          this.subject_totals = response.data.subjects;
          this.grade_totals = response.data.grades;
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    },
    async getTotalForGrade() {
      await axios
        .get(`/lessons/grade/${this.$store.state.user.grade}`)
        .then((response) => {
          this.total_for_grade = response.data.lessons.length;
          return response.data.lessons.length;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    },
    async getLatestForGrade() {
      await axios
        .get(`/lessons/grade/${this.$store.state.user.grade}/latest`)
        .then((response) => {
          return (this.latest_lesson = response.data.lesson);
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    },
    async getTotalForGradeSubjects() {
      await axios
        .get(`/lessons/total/subjectsByGrade/${this.$store.state.user.grade}`)
        .then((response) => {
          this.subject_totals = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getFiveLatestLessons() {
      await axios
        .get(`/lessons/latest/5/${this.$store.state.user.grade}`)
        .then((response) => {
          this.latest_lessons = response.data.lessons;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    },
    async getFiveLatestAuthorLessons() {
      await axios
        .get(`/lessons/latest/5/author`)
        .then((response) => {
          this.latest_author_lessons = response.data.lessons;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    },
    async getFiveLatestLessonsAll() {
      await axios
        .get(`/lessons/latest/5`)
        .then((response) => {
          this.latest_lessons_all = response.data.lessons;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    },
    async getFiveLatestLessonsFromAll() {
      await axios.get(`/lessons/latest/5`).then((response) => {
        this.latest_lessons = response.data.lessons;
      });
    },
    async getAllGradeTotals() {
      await axios
        .get(`/lessons/total/grades`)
        .then((response) => {
          this.all_grade_totals = response.data;
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    },
    async getAllSubjectTotals() {
      await axios
        .get(`/lessons/total/subjects`)
        .then((response) => {
          this.all_subject_totals = response.data;
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    },
    async getTeacherData() {
      await axios
        .get(`/lessons/total/teachers`)
        .then((response) => {
          this.usersData = response.data;
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.my-block {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  min-height: 100%;
  margin-right: 20px;
  min-width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
}

.my-block:last-child {
  margin-right: 0;
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

.lesson_box_grade {
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
.lesson_box_date {
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
