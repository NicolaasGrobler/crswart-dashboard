<template>
  <transition name="fade" mode="out-in">
    <router-view></router-view>
  </transition>
</template>

<script>
export default {
  name: "Lessons",
  title: "CR Swart Lessons",
  data() {
    return {
      lessons: [],
      subjects: [],
      grade: "",
      subject: "",
    };
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.1s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}

.grade {
  width: 100%;
  height: 100px;
  background: #b89c6a;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.grade:hover {
  background: #947e59;
  color: white;
}

.subject {
  background: #b89c6a;
  cursor: pointer;
  height: 150px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
  border-radius: 5px;
  font-size: 20px;
  font-weight: 700;
  color: white;
  transition: background 0.2s;
}

.subject:hover {
  background: #947e59;
  color: white;
}

.date {
  margin: 0px !important;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 10px !important;
}
</style>
