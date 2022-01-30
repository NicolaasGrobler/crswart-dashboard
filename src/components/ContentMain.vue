<template>
  <div class="main-content-nav">
    <!-- Back Button -->
    <b-icon icon="arrow-left" 
        custom-size="mdi-24px" class="back nav-icon"> </b-icon>
    <!-- Breadcrumbs -->
    <b-breadcrumb separator="has-succeeds-separator" style="font-size: 15px !important;">
      <b-breadcrumb-item href="/">Home</b-breadcrumb-item>
      <b-breadcrumb-item href="/documentation">Docs</b-breadcrumb-item>
      <b-breadcrumb-item href="/documentation/breadcrumb" active
        >Breadcrumb</b-breadcrumb-item
      >
    </b-breadcrumb>

    <div class="right-side">
      <!-- Welcome Text -->
      <p style="margin-right: 10px"> {{user.name}} </p>
      <!-- Notifications -->
      <b-icon
        icon="bell-outline"
        custom-size="mdi-24px"
        class="notifications nav-icon"
      >
      </b-icon>
      <!-- Avatar -->
      <img src="https://thispersondoesnotexist.com/image" alt="Avatar" width="35px" class="avatar">
    </div>
  </div>
</template>

<script>
export default {
  name: "ContentMain",
  props: {
    user: {
      name: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.main-content-nav {
  width: 100%;
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
