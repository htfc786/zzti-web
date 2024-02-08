<template>
  <div class="main">
    <a-row class="header" type="flex" align="middle">
      <a-col flex="200px" style="margin: 0 auto">
        <RouterLink to="/">
          <a-row align="middle">
            <img src="/vite.svg" alt="vite.svg" />
            <span class="title">Vite + Vue + TS</span>
          </a-row>
        </RouterLink>
      </a-col>
      <a-col flex="auto">
        <a-menu
          mode="horizontal"
          :selected-keys="selectedKeys"
          @click="doClickMenu"
        >
          <a-menu-item key="/index">默写</a-menu-item>
          <a-menu-item key="/random">抽题</a-menu-item>
          <a-menu-item key="/questions">列表</a-menu-item>
          <a-menu-item>
            <a href="https://github.com/htfc786/zzti-web" target="_blank">
              <github-outlined /> 代码开源
            </a>
          </a-menu-item>
        </a-menu>
      </a-col>
    </a-row>
    <div class="content">
      <router-view />
    </div>
    <div class="footer">
      <span><TJzk2024/></span>
      <span>备注：{{ notes }}</span>
      <span><a href="https://github.com/htfc786/zzti-web" target="_blank">zzti-web</a> - 帮政治老师开发的默写抽题系统 by htfc786</span>
      <span>前端代码感谢：<a href="https://github.com/liyupi/sql-mother" target="_blank">SQL之母</a> by 鱼皮</span>
      <span>本站使用Github搭建</span>
      <span><a-switch v-model:checked="dark_mode" />夜间模式</span>
    </div>
  </div>
  <a-back-top :style="{ right: '24px' }" />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { GithubOutlined } from '@ant-design/icons-vue';
import { storeToRefs } from 'pinia'

import TJzk2024 from './components/2024TJzk.vue';
import { globalStore } from './core/globalStore.ts'
import { isSupportedCssVariable } from './core/tools';
import { note as questionNote } from './core/question';

const store = globalStore();
const route = useRoute();
const router = useRouter();

const notes = ref<string>(questionNote);
// const notes = ref<string>("暂无信息");

//夜间模式
const dark_mode = storeToRefs(store).dark_mode;

// 使中间容器铺满
const changeContentMinHeight = () => {
  const headerHeight = (<HTMLElement>document.querySelector(".header"))?.offsetHeight;
  const footerHeight = (<HTMLElement>document.querySelector(".footer"))?.offsetHeight;
  const content = <HTMLElement>document.querySelector(".content");
  const contentMinHeight = window.innerHeight - headerHeight - footerHeight + 22;
  content.style.minHeight = contentMinHeight + "px";
  if (isSupportedCssVariable()) {
    const { marginTop: mt, marginBottom: mb } = window.getComputedStyle(content);
    const allMargin = parseInt(mt, 10) + parseInt(mb, 10);
    content.style.setProperty('--content-min-height', (contentMinHeight - allMargin) + "px");
  }
};

// 显示蓝条url
const selectedKeys = computed(() => {
  return ["/" + route.path.split("/")[1]];
});

/**
 * 点击菜单跳转
 * @param key
 */
const doClickMenu = ({ key }: any) => {
  if (key) {
    router.push({
      path: key,
    });
  }
};

// 夜间模式切换
watch(dark_mode, ()=>{
  if (dark_mode.value) {
    document.body.classList.add("dark")
  } else {
    document.body.classList.remove("dark")
  }
}, { immediate: true });

onMounted(() => {
  window.addEventListener("resize", changeContentMinHeight);
  changeContentMinHeight();
});
onUnmounted(() => {
  window.removeEventListener("resize", changeContentMinHeight);
});
</script>

<style scoped>
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 24px;
}
.header .title {
  margin-left: 8px;
  font-size: 20px;
  color: #000;
}
.header .ant-menu {
  line-height: 64px;
  border-bottom: none !important;
}
.content {
  padding: 24px;
}
.footer {
  padding: 12px;
  text-align: center;
  background: #efefef;
  font-size: 14px;
}
.footer span {
  display: block;
  margin: 0;
}
body.dark {
  background-color: #000 !important;
  color: #fff !important;
}
body.dark * {
  background-color: #000 !important;
  color: #fff !important;
}
.dark .ant-list-item {
  color: #fff !important;
}
</style>
