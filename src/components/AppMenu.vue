<template>
  <div class="app-menu">
    <!-- Links -->
    <b-menu :activable="false">
      <b-menu-list label="Menu">
        <!-- Dashboard -->
        <b-menu-item
          icon="view-dashboard"
          label="Dashboard"
          tag="router-link"
          to="/"
          :active="$route.path === '/'"
        ></b-menu-item>
        <!-- Lessons -->
        <b-menu-item icon="book" :active="$route.path.match(/(\/lessons\/)/g) ? true : false">
          <template #label="props">
            Lessons
            <b-icon
              class="is-pulled-right"
              :icon="props.expanded ? 'menu-up' : 'menu-down'"
            ></b-icon>
          </template>
          <!-- Create Lesson -->
          <b-menu-item
            icon="book-plus"
            label="Create Lesson"
            tag="router-link"
            to="/lessons/create"
            :active="$route.path === '/lessons/create'"
          ></b-menu-item>
          <!-- View Lessons -->
          <b-menu-item
            icon="book-education"
            label="View Lesson"
            tag="router-link"
            to="/lessons/view"
            :active="$route.path === '/lessons/view'"
          ></b-menu-item>
        </b-menu-item>
        <!-- Administrator -->
        <b-menu-item
          icon="shield-crown"
          v-if="$store.state.user.roles.includes('admin')"
          :active="$route.path.match(/(\/admin\/)/g) ? true : false"
        >
          <template #label="props">
            Administrator
            <b-icon
              class="is-pulled-right"
              :icon="props.expanded ? 'menu-up' : 'menu-down'"
            ></b-icon>
          </template>
          <!-- Subjects -->
          <b-menu-item
            icon="shape"
            label="Subjects"
            tag="router-link"
            to="/admin/subjects"
            :active="$route.path === '/admin/subjects'"
          ></b-menu-item>
          <!-- Users -->
          <b-menu-item
            icon="account"
            label="Users"
            tag="router-link"
            to="/admin/users"
            :active="$route.path === '/admin/users'"
          ></b-menu-item>
        </b-menu-item>
        <b-menu-item
          icon="account"
          label="My Account"
          tag="router-link"
          to="/my-account"
          :active="$route.path === '/my-account'"
        >
          <!-- <b-menu-item label="Account data"></b-menu-item>
                <b-menu-item label="Addresses"></b-menu-item> -->
        </b-menu-item>
      </b-menu-list>
      <b-menu-list>
        <b-menu-item
          label="Website"
          icon="link"
          target="_blank"
          href="https://www.hspcrswart.co.za"
        ></b-menu-item>
      </b-menu-list>
    </b-menu>
  </div>
</template>

<script>
export default {
  name: "AppMenu",
  data() {
    return {};
  }
};
</script>

<style></style>
