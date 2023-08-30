<template>
  <div class="random">
    <div class="select">
      <a-row type="flex" align="center">
        <a-col style="margin-right: 8px">抽题范围: </a-col>
        <a-col flex="auto">
          <a-tree-select
            v-model:value="treeValue"
            :tree-data="treeData"
            style="width: 100%"
            tree-checkable
            allow-clear
            :show-checked-strategy="TreeSelect.SHOW_PARENT"
            placeholder="Please select"
            tree-node-filter-prop="label"
            :tree-line="true"
          />
        </a-col>
      </a-row>
    </div>
    <div class="question">
      <a-spin class="" size="large" :spinning="isLoading">
        <h1 :style="{ 'font-size': fontSize + 'px' }">{{ question }}</h1>
      </a-spin>
    </div>
    <div class="bottom">
      <fontResize v-model:value="fontSize" />
      <a-button class="rand-btn" type="primary" size="large" @click="randQues()"
        >再来一道</a-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { TreeSelectProps } from 'ant-design-vue'
import { TreeSelect, message } from 'ant-design-vue'
import { randomOneQuestionByPathList } from '../core/random'
import {
  getTreeDataByQues,
  getPathListByTreeValueList,
} from '../core/questions'
import fontResize from '../components/fontResize.vue'

// 显示的问题
const question = ref('')
// 是否处于加载中
const isLoading = ref<boolean>(false)
// 选择的范围
const treeValue = ref<string[]>(['\\'])
// 选择的字体大小
const fontSize = ref<number>(40)

// 加载选择范围数据
const treeData: TreeSelectProps['treeData'] = getTreeDataByQues()
// 路径列表
var pathList: Array<Array<string | null>> = [[]]

watch(
  treeValue,
  () => {
    pathList = getPathListByTreeValueList(treeValue.value)
  },
  { immediate: true }
)

const randQues = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    const r_Question = randomOneQuestionByPathList(pathList)
    if (r_Question) {
      question.value = r_Question
    } else {
      question.value = ''
      message.error('当前抽取范围不存在或没有题目！')
    }
  }, 300)
}

onMounted(() => {
  randQues()
})
</script>

<style scoped>
.random {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  min-height: var(--content-min-height);
}
.select .ant-row {
  align-items: center;
  margin-bottom: 8px;
}
.random .rand-btn {
  width: 150px;
  height: 60px;
  font-size: 25px;
}
.question {
  align-self: center;
  margin: 0 40px 20px 40px;
}
.question h1 {
  margin: 0;
  cursor: context-menu;
}
.bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
