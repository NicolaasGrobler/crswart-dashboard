import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem("token")) {
        next();
      } else {
        next("/login");
      }
    },
    children: [
      {
        path: "/",
        name: "Dashboard",
        component: () => import("../views/Dash.vue"),
      },
      {
        path: "/my-account",
        name: "My Account",
        component: () => import("../views/MyAccount.vue"),
      },
      {
        path: "/admin/subjects",
        name: "Subjects",
        component: () => import("../views/admin/Subjects.vue"),
      },
      {
        path: "/admin/users",
        name: "Users",
        component: () => import("../views/admin/Users.vue"),
      },
      {
        path: "/lessons/create",
        name: "Create Lesson",
        component: () => import("../views/lessons/Create.vue"),
      },
      {
        path: "/lessons/edit/:uuid",
        name: "Edit Lesson",
        component: () => import("../views/lessons/Edit.vue"),
      },
      {
        path: "/lessons",
        name: "Lessons",
        component: () => import("../views/lessons/View.vue"),
      },
      {
        path: "/lessons/mine",
        name: "My Lessons",
        component: () => import("../views/lessons/MyLessons.vue"),
      },
      {
        path: "/lessons/for-me",
        name: "For Me",
        component: () => import("../views/lessons/ForMe.vue"),
      },
      {
        path: "/lessons/:uuid",
        name: "Lesson View",
        component: () => import("../views/lessons/LessonView.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
