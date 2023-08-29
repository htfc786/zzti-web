import { RouteRecordRaw } from "vue-router";
import IndexPage from "../pages/IndexPage.vue";

/**
 * 路由列表
 */
export default [
  {
    path: "/",
    component: IndexPage,
    props: true,
  },
  {
    path: "/about",
    component: () => import("../pages/AboutPage.vue"),
    props: true,
  },
  {
    path: "/random",
    component: () => import("../pages/RandomPage.vue"),
    props: true,
  },
  {
    path: "/questions",
    component: () => import("../pages/QuestionsPage.vue"),
    props: true,
  },
  // 404页面
  {
    path: "/404",
    component: () => import("../pages/404Page.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
] as RouteRecordRaw[];
