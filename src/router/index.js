// File: src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "../layouts/adminLayout.vue";
import HomeLayout from "../layouts/homeLayout.vue";
import ConferenceLayout from "../layouts/conferenceLayout.vue";
import FormLayout from "../layouts/formLayout.vue";
import { authGuard } from './guards';

const routes = [
  {
    path: "/conference/:id",
    component: ConferenceLayout,
    meta: { role: [1] }, 
    children: [
      {
        path: "",
        component: () => import("../views/conference.vue"),
        meta: { role: [1] },
      },
      {
        path: "/files/:id",
        component: () => import("../views/files.vue"),
        meta: { role: [1] },
      },
    ],
  },
  {
    path: "/",
    component: HomeLayout,
    meta: { role: [1] }, 
    children: [
      {
        path: "/",
        redirect: "/index",
      },
      {
        path: "/index",
        component: () => import("../views/index.vue"),
        meta: { role: [1] },
      },
      {
        path: "/login",
        component: () => import("../views/login.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/blog",
        component: () => import("../views/blog.vue"),
        meta: { role: [1] },
      },
      {
        path: "/conference",
        component: () => import("../views/conference.vue"),
        meta: { role: [1] },
      },
      {
        path: "/privacy-policy",
        component: () => import("../views/privacy-policy.vue"),
        meta: { role: [1] },
      },
      {
        path: "/terms",
        component: () => import("../views/terms.vue"),
        meta: { role: [1] },
      },
    ],
  },
  {
    path: "/admin",
    component: AdminLayout,
    beforeEnter: authGuard,
    meta: { role: [1,3] },
    children: [
      {
        path: "dashboard",
        component: () => import("../views/admin/dashboard.vue"),
        name: 'dashboard',
        meta: { role: [1] },
      },
      {
        path: "conferenceVersion",
        component: () => import("../views/admin/conferenceVersion.vue"),
        meta: { role: [1] },
      },
      {
        path: "setting",
        component: () => import("../views/admin/setting.vue"),
        meta: { role: [1] },
      },
      {
        path: "conferenceVersionSetting",
        component: () => import("../views/admin/conferenceVersionSetting.vue"),
        meta: { role: [1] },
      },
      {
        path: "conferenceVersionAbout",
        component: () => import("../views/admin/conferenceVersionAbout.vue"),
        meta: { role: [1] },
      },
      {
        path: "blog",
        component: () => import("../views/admin/blog.vue"),
        meta: { role: [1] },
      },
      {
        path: "categories",
        component: () => import("../views/admin/categories.vue"),
        meta: { role: [1] },
      },
      {
        path: "sliders",
        component: () => import("../views/admin/slider.vue"),
        meta: { role: [1] },
      },
      {
        path: "committees",
        component: () => import("../views/admin/committees.vue"),
        meta: { role: [1] },
      },
      {
        path: "committeesCategories",
        component: () => import("../views/admin/committeesCategories.vue"),
        meta: { role: [1] },
      },
      {
        path: "committeesItems",
        component: () => import("../views/admin/committeesItems.vue"),
        meta: { role: [1] },
      },
      {
        path: "tips",
        component: () => import("../views/admin/tips.vue"),
        meta: { role: [1] },
      },
      {
        path: "tipItemes",
        component: () => import("../views/admin/tipItemes.vue"),
        meta: { role: [1] },
      },
      {
        path: "faqs",
        component: () => import("../views/admin/faqs.vue"),
        meta: { role: [1] },
      },
      {
        path: "files",
        component: () => import("../views/admin/files.vue"),
        meta: { role: [1] },
      },
      {
        path: "participantsFromOutside",
        component: () => import("../views/admin/participantsFromOutside.vue"),
        meta: { role: [1] },
      },
      {
        path: "participantsFromInside",
        component: () => import("../views/admin/participantsFromInside.vue"),
        meta: { role: [1] },
      },
      {
        path: "registrationOfAttendanceForm",
        component: () => import("../views/admin/registrationOfAttendanceForm.vue"),
        meta: { role: [1, 3] },
      },
    ],
  },
  {
    path: "/forms",
    component: FormLayout,
    children: [
      {
        path: "outsideform",
        component: () => import("../views/forms/outsideform.vue"),
      },
      {
        path: "insideform",
        component: () => import("../views/forms/insideform.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;