<template>
  <a-breadcrumb>
    <a-breadcrumb-item><a @click="gotoPath([])" class="d-item">全部题目</a></a-breadcrumb-item>
    <a-breadcrumb-item v-for="(path, index) in questionPath">
      <a @click="gotoPathByIndex(index)" class="d-item">{{ path }}</a>
    </a-breadcrumb-item>
  </a-breadcrumb>
  <a-row type="flex" align="start">
    <a-col flex="100px" style="margin-right: 16px">
      <a-menu
        style="width: 250px"
        mode="inline"
        :items="menuItems"
        v-model:selectedKeys="selectedKeys"
        @click="handleClick"
      ></a-menu>
    </a-col>
    <a-col flex="auto">
      <a-list item-layout="horizontal" :data-source="questionData">
        <template #renderItem="{ item, index }">
          <a-list-item>
            <span class="d-item">{{ index + 1 }}、{{ item }}</span>
          </a-list-item>
        </template>
      </a-list>
    </a-col>
  </a-row>
</template>
<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import type { MenuProps, ItemType } from 'ant-design-vue'
import {
  getMenuKeyByPath,
  getMenuObj,
  getPathByMenuKey,
} from '../core/questions'
import { getQuestionByPath } from '../questions'

// 获取菜单元素对象
const menuItems: ItemType[] = getMenuObj()
const selectedKeys = ref<string[]>([''])
//题目列表信息
const questionData = <any>ref([])
// 题目路径
const questionPath = <any>ref([])

// 菜单值更改时，重新获取路径
const handleClick: MenuProps['onClick'] = (e) => {
  if (!e.keyPath) {
    return
  }
  questionPath.value = getPathByMenuKey(e.keyPath)
}

// 当路径改变时重新获取题目
watchEffect(() => {
  const questions = getQuestionByPath(questionPath.value)
  if (!questions) {
    questionData.value = []
    return
  }
  questionData.value = questions
})

const gotoPath = (path: Array<string | null>) => {
  questionPath.value = path
  selectedKeys.value = getMenuKeyByPath(path, menuItems)
}

const gotoPathByIndex = (index: number) => {
  const res = []
  for (var i = 0, len = questionPath.value.length; i < len; i++) {
    if (i > index) {
      break
    }
    res.push(questionPath.value[i])
  }
  questionPath.value = res
  selectedKeys.value = getMenuKeyByPath(res, menuItems)
}
</script>

<style scoped>
.ant-breadcrumb {
  margin-left: 25px;
  margin-bottom: 10px;
}
/* 夜间模式样式 */
.dark .d-item {
  background-color: #000 !important;
  color: #fff !important
}
.dark .ant-menu {
  background-color: #000 !important;
  color: #fff !important
}
.dark .ant-menu::v-deep .ant-menu-item-selected {
  background-color: #333 !important;
}
.dark .ant-menu::v-deep .ant-menu-submenu-title:hover {
  color: rgba(255, 255, 255, 0.88);
}
.dark .ant-breadcrumb::v-deep .ant-breadcrumb-separator {
  color: rgba(255, 255, 255, 0.45);
}
</style>
