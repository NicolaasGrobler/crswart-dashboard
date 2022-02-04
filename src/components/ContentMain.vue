<template>
  <div class="main-content-nav">
    <!-- Back Button -->
    <div @click="back" v-if="breadcrumbs.length > 1">
      <b-icon icon="arrow-left" custom-size="mdi-24px" class="back nav-icon">
      </b-icon>
    </div>
    <!-- Breadcrumbs -->
    <b-breadcrumb
      separator="has-succeeds-separator"
      style="font-size: 15px !important"
    >
      <b-breadcrumb-item
        style="font-weight: bold !important"
        tag="router-link"
        :to="breadcrumb.path"
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="index"
        :active="breadcrumb.active"
        >{{ breadcrumb.name }}</b-breadcrumb-item
      >
    </b-breadcrumb>

    <div class="right-side">
      <!-- Welcome Text -->
      <p style="margin-right: 10px">
        {{ $store.state.user.name }} {{ $store.state.user.surname }}
      </p>
      <!-- Notifications -->
      <b-icon
        icon="bell-outline"
        custom-size="mdi-24px"
        class="notifications nav-icon"
      >
      </b-icon>
      <!-- Avatar -->
      <img
        src="https://thispersondoesnotexist.com/image"
        alt="Avatar"
        width="35px"
        class="avatar"
        @click="$router.push('/my-account')"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "ContentMain",
  data() {
    return {
      breadcrumbs: [],
    };
  },
  watch: {
    // call again the method if the route changes
    $route: "createBreacrumbs",
  },
  created() {
    this.createBreacrumbs();
  },
  methods: {
    back() {
      if (this.breadcrumbs.length > 1) {
        this.$router.push({
          path: this.breadcrumbs[this.breadcrumbs.length - 2].path,
        });
      }
    },
    createBreacrumbs() {
      if (this.$route.params.uuid) {
        this.breadcrumbs = [
          {
            name: "Dashboard",
            path: "/",
            active: false,
          },
          {
            name: "Lessons",
            path: "/lessons",
            active: false,
          },
          {
            name: this.$route.params.uuid,
            path: `/lessons/${this.$route.params.uuid}`,
            active: true,
          },
        ];
      } else {
        // Create breadcrumbs from matched routes
        this.breadcrumbs = this.$route.matched.map((route) => {
          return {
            name: route.name,
            path: route.path || "/",
          };
        });
      }

      this.breadcrumbs[this.breadcrumbs.length - 1].active = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.main-content-nav {
  width: 100%;
  min-height: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: stretch;
  padding: 0px 15px;

  border-bottom: 1px solid rgb(235, 235, 235);
}

$primary: #b89c6a;
$grey: #363636;

.back {
  margin-right: 15px;
  color: $primary;
  cursor: pointer;
}

.back:hover {
  color: $grey;
}

.notifications {
  color: $grey;
  cursor: pointer;
}

.notifications:hover {
  color: $primary;
}

.breadcrumb {
  flex: 1;
  display: flex !important;
  align-items: center !important;
  height: 100%;
  margin: 0px !important;
}

.nav-icon {
  font-size: 15px !important;
}

.right-side {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

.avatar {
  border-radius: 50%;
  border: 2px solid rgb(235, 235, 235);
  margin-left: 15px;
  width: 35px;
  height: 35px;
  cursor: pointer;
}

.avatar:hover {
  border: 2px solid $primary;
}
</style>
