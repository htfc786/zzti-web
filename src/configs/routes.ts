import { RouteRecordRaw } from "vue-router";
import IndexPage from "../pages/IndexPage.vue";
import AboutPage from "../pages/AboutPage.vue";

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
    component: AboutPage,
    props: true,
  },
] as RouteRecordRaw[];
