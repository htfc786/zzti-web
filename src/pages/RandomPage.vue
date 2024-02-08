<template>
  <div class="random">
    <div class="select">
      <a-row type="flex" align="left">
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
      <a-row type="flex" align="left">
        <a-col style="margin-right: 8px">
          <a-switch v-model:checked="isNoRepeat" /> 防止重复
          <a-button v-if="isNoRepeat" @click="noRepeatReadd" size="small">重加</a-button>
        </a-col>
        <a-col>
          <a-switch v-model:checked="isOrder" /> 顺序模式
        </a-col>
      </a-row>
    </div>
    <div class="question">
      <a-spin class="" size="large" :spinning="isLoading">
        <h1 v-if="question.q" :style="{ 'font-size': fontSize + 'px' }">{{ question.q }}</h1>
        <a-button v-if="question.audio" type="primary" size="small" @click="playSound(question.audio)">音频播放</a-button>
      </a-spin>
    </div>
    <div class="bottom">
      <fontResize v-model:value="fontSize" />
      <div class="btn-area">
        <template v-if="question.ans">
          <a-popover title="答案查看" trigger="click" placement="top">
            <template #content>
              <span class="ans-text">{{ question.ans }}</span>
            </template>
            <a-button class="ans-btn" size="small">答案</a-button>
          </a-popover>
        </template>
        <template v-else>
          <a-button class="ans-btn" size="small" disabled>答案</a-button>
        </template>
        <a-button class="rand-btn" type="primary" size="large" @click="randQues()">再来一道</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { TreeSelectProps } from 'ant-design-vue'
import { TreeSelect, message } from 'ant-design-vue'

import { randomOneQuestionByPathList, getOneQuestionByIndex, randomOneQuestion } from '../core/random'
import { getTreeDataByQues, getTreeValueListByPathList } from '../core/ui'
import { getQuestionByPathList, getPathListByTreeValueList, checkPathList, } from '../core/question'
import fontResize from '../components/fontResize.vue'
import { globalStore } from '../core/globalStore.ts'

const store = globalStore();

// 显示的问题
const question = ref<any>({q: "", ans: ""})
// 是否处于加载中
const isLoading = ref<boolean>(false)
// 选择的范围
const treeValue = ref<Array<string>>(["\\"])
// 选择的字体大小
const fontSize = ref<number>(40)
// 是否按顺序
const isOrder = ref<boolean>(false)
// 是否防止重复
const isNoRepeat = ref<boolean>(false)

// 加载选择范围数据
const treeData: TreeSelectProps['treeData'] = getTreeDataByQues()
// 路径列表
var pathList: Array<Array<string | null>> = [[]]
// 按顺序模式中的 index
var orderIndex: number = 0
// 否防止重复模式中的题目列表
let noRepQuesList: Array<string|null> | null = null;

// 重选抽题范围时自动修改路径列表
watch(treeValue, () => {
  pathList = getPathListByTreeValueList(treeValue.value)
  // 防止重复模式中的题目列表题目列表清空
  noRepQuesList = null
}, { immediate: true })

watch(treeValue, () => {
  //保存历史记录
  store.history.data = pathList
})

// 排序记录清零
watch(isOrder, () => {
  orderIndex = 0
  // 防止防止重复模式和按顺序模式同时开启
  if (isNoRepeat.value && isOrder.value) {
    isNoRepeat.value = false
  }
  // 保存历史记录
  if (isOrder.value) {
    store.oneQuesMode = "order";
  } else if (!isNoRepeat.value && !isOrder.value) {
    store.oneQuesMode = "null";
  }
})

// 防止重复模式中的题目列表题目列表清空
watch(isNoRepeat, () => {
  noRepQuesList = null
  // 防止防止重复模式和按顺序模式同时开启
  if (isNoRepeat.value && isOrder.value) {
    isOrder.value = false
  }
  // 保存历史记录
  if (isNoRepeat.value) {
    store.oneQuesMode = "noRepeat";
  } else if (!isNoRepeat.value && !isOrder.value) {
    store.oneQuesMode = "null";
  }
})

// 自动播放音频
watch(question, () => {
  if (question.value || question.value.audio) {
    playSound(question.value.audio);
  }
})

const orderQues = () => {
  const r_Question = getOneQuestionByIndex(pathList, orderIndex)
  if (!r_Question) {
    orderIndex = 0
    const rs_Question = getOneQuestionByIndex(pathList, orderIndex)
    if (!rs_Question) {
      question.value = ''
      message.error('当前抽取范围不存在或没有题目！')
      return;
    }
    question.value = rs_Question
    message.info('当前抽取范围的题目已经全部抽取完毕，已自动重置')
    orderIndex++
    return;
  } 
  question.value = r_Question
  orderIndex++
}

const noRepeatQues = () => {
  if (noRepQuesList === null) {
    noRepQuesList = getQuestionByPathList(pathList)
  }
  if (noRepQuesList && noRepQuesList.length === 0) {
    question.value = ''
    message.info('所有题目全部抽取完毕，自动重置')
    noRepQuesList = getQuestionByPathList(pathList)
  }
  if (!noRepQuesList) {//如果还是没有，宣告没有题目
    question.value = ''
    message.error('当前抽取范围不存在或没有题目！')
    return;
  }
  const ques = randomOneQuestion(noRepQuesList);
  question.value = ques || "";
  //从抽取列表中删除
  noRepQuesList = noRepQuesList.filter(item => item !== ques)
}

// 防止重复模式题目重添加
const noRepeatReadd = () => {
  if (!isNoRepeat.value || !noRepQuesList) {
    return;
  }
  // 一道题只添加一次
  if (noRepQuesList.indexOf(question.value) > -1) {
    message.error('禁止重复添加！！！')
    return;
  }
  noRepQuesList.push(question.value)
  message.info('当前题目重新已添加到题目列表中')
}

// 随机抽取题目
const randQues = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    if (isOrder.value) {  //顺序
      orderQues()
      return;
    }
    if (isNoRepeat.value) {  //防止重复
      noRepeatQues()
      return;
    }
    // 正常抽取
    const r_Question = randomOneQuestionByPathList(pathList)
    if (r_Question) {
      question.value = r_Question
    } else {
      question.value = ''
      message.error('当前抽取范围不存在或没有题目！')
    }
  }, 300)
}

// 加载历史记录
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

// 加载历史模式
const loadHistoryMode = () => {
  if (!store.oneQuesMode) {
    return;
  }
  switch (store.oneQuesMode) {
    case "order": isOrder.value = true; break;
    case "noRepeat": isNoRepeat.value = true; break;
    default: break;
  }
}

const playSound = (url: string) => {
  const sound = new Audio(url);
  sound.play();
}

onMounted(() => {
  // 加载历史记录
  loadHistoryMode()
  loadHistory()
  // 自动抽取题目
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
.bottom .btn-area {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.random .rand-btn {
  width: 150px;
  height: 60px;
  font-size: 25px;
}
.random .ans-btn {
  height: 30px;
  margin-right: 8px;
  font-size: 15px;
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
}px
.ans-text {
  max-width: 200px;
}
</style>