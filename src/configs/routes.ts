import { RouteRecordRaw } from "vue-router";

/**
 * 路由列表
 */
export default [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    component: () => import("../pages/IndexPage.vue"),
  },
  {
    path: "/random",
    component: () => import("../pages/RandomPage.vue"),
  },
  {
    path: "/questions",
    component: () => import("../pages/QuestionsPage.vue"),
  },
  {
    path: "/card",
    component: () => import("../pages/CardPage.vue"),
  },
  {
    path: "/tools",
    children: [
      {
        path: "word",
        component: () => import("../pages/tools/word.vue"),
      },
      {
        path: "wyw",
        component: () => import("../pages/tools/wyw.vue"),
      },
    ]
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
