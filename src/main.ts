import { createApp } from 'vue'
import * as VueRouter from "vue-router";
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import routes from "./configs/routes";
import App from './App.vue'
import './style.css'

// 路由
const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(), // 哈希模式
  routes,
});

// 状态管理
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App).use(router).use(pinia).mount('#app')
