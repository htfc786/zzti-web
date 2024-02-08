<template>
  <div class="index">
    <div class="select">
      <a-row type="flex" align="center">
        <a-col style="margin-right: 8px">抽取范围: </a-col>
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
      <a-row type="flex" align="center" class="q-num">
        <a-col>题目数量: </a-col>
        <a-col v-for="num in numList">
          <a-button size="small" @click="randQuesByNum(num)">{{ num }}</a-button>
        </a-col>
        <a-col>
          <a-button size="small" @click="randQuesByNum(0)">全部</a-button>
        </a-col>
        <a-col>
          <a-input-number v-model:value="questionNum" :min="1" />
        </a-col>
        <a-col>
          <a-button type="primary" size="large" @click="randQues()">生成！</a-button >
        </a-col>
      </a-row>
    </div>
    <div style="display: flex;">
      <fontResize
        v-model:value="fontSize"
        :min="10"
        :max="80"
        :default="28"
        :step="5"
      />
      <a-button type="link" @click="isShow=!isShow">{{ isShow ? "收起" : "展开" }}</a-button>
    </div>
    <div class="question">
      <a-spin class="" size="large" :spinning="isLoading">
        <a-list item-layout="horizontal" :data-source="questionList">
          <template #renderItem="{ item, index }">
            <a-list-item :class="{ 'audio': item.audio }">
              <h1 class="d-item" :style="{ 'font-size': fontSize + 'px' }">
                {{ index + 1 }}、{{ item.q || "" }}
              </h1>
            <a-button v-if="item.audio" type="primary" size="small" @click="playSound(item.audio)">音频播放</a-button>
            </a-list-item>
          </template>
        </a-list>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { TreeSelectProps } from 'ant-design-vue'
import { message, TreeSelect } from 'ant-design-vue'

import fontResize from '../components/fontResize.vue'
import { getTreeDataByQues, getTreeValueListByPathList } from '../core/ui'
import { getPathListByTreeValueList, checkPathList } from '../core/question'
import { randomQuestionsByPathList } from '../core/random'
import { globalStore } from '../core/globalStore.ts'

const store = globalStore();
const router = useRouter()

// 加载选择范围数据
const treeData: TreeSelectProps['treeData'] = getTreeDataByQues()
// 题目数量预设按钮
const numList = [1, 2, 3, 5, 10, 15, 20, 25, 50]

// 是否处于加载中
const isLoading = ref<boolean>(false)
// 选择的范围
const treeValue = ref<Array<string>>(["\\"])
// 随机到的题目列表信息
const questionList = ref<Array<string | null>>([])
// 随机到的题目数量
const questionNum = ref<number>(5)
// 字体大小
const fontSize = ref<number>(28)
// 是否显示面板
const isShow = ref<boolean>(true)

// 路径列表
var pathList: Array<Array<string | null>> = [[]]

watch(treeValue, () => {
  pathList = getPathListByTreeValueList(treeValue.value)
}, { immediate: true })

watch(treeValue, () => {
  //保存历史记录
  store.history.data = pathList
})

watch(isShow, ()=>{
  const indexDom = <HTMLElement>document.querySelector(".index")
  if (isShow.value) {
    indexDom.classList.remove("select_hide")
  } else {
    indexDom.classList.add("select_hide")
  }
})

const randQues = () => {
  if (questionNum.value == 1) {
    router.push('/random')
    return
  }
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    // 等待。就是要那种感觉
    const r_Question = randomQuestionsByPathList(pathList, questionNum.value)
    if (r_Question) {
      if (!r_Question.length) {
        questionList.value = [];
        message.error('当前抽取范围不存在或没有题目！')
        return;
      }
      if (r_Question.length < questionNum.value) {
        message.warning(
          '您要求的题目数量 大于 当前抽取范围全部的题目数量，已自动展示全部题目'
        )
      }
      if (questionNum.value == 0) {
        questionNum.value = r_Question.length
      }
      questionList.value = r_Question
    }
  }, 600)
}

const randQuesByNum = (num: number) => {
  questionNum.value = num
  randQues()
}

const loadHistory = () => {
  let history = store.history
  if (!history.data) {
    return;
  }
  const { pathList: newPathList, error, del } = checkPathList(history.data)
  if (error) {
    // 错误
    if (del) {
      message.warn(`不存在的路径 ${del.join(", ")} ，已自动从历史记录中删除`)
    }
    history.data = newPathList;
  }
  
  if (history.data.length == 0){
    return;
  }
  pathList = history.data
  treeValue.value = getTreeValueListByPathList(history.data)
  message.info("已自动加载上次选择的抽题范围了")
}

const playSound = (url: string) => {
  const sound = new Audio(url);
  sound.play();
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.index {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  min-height: var(--content-min-height);
}
.select_hide .select {
  display: none;
}
.select .ant-row {
  align-items: center;
  margin-bottom: 8px;
  justify-content: flex-start;
}
.select .q-num .ant-col {
  margin-right: 8px;
}
.question {
  margin: 0 10px;
}
.question h1 {
  margin: 0;
  cursor: context-menu;
}

.audio {
  justify-content: flex-start;
}
.audio > .ant-btn {
  margin-right: 8px;
}

/* 夜间模式样式 */
.dark .d-item {
  background-color: #000 !important;
  color: #fff !important
}
</style>