<template>
  <div id="wordTool">
    <a-row type="flex" class="start">
      <a-col class="left" flex="auto">
        <!-- 说明 -->
        <a-typography-title :level="2">单词表解析工具</a-typography-title>
        <a-typography-title :level="4">说明</a-typography-title>
        <p>支持外研版高中英语电子版单词表解析</p>
        <p>可前往<a href="https://basic.smartedu.cn/tchMaterial?defaultTag=e7bbcefe-0590-11ed-9c79-92fc3b3249d5%2F6a7495dc-0772-11ed-ac74-092ab92074e6%2F44bedbe2-54e6-11ed-9c34-850ba61fa9f4" target="_blank">智慧中小学网站</a>选择对应的书籍复制单词表</p>
        <!-- 文本域 -->
        <a-textarea
          v-model:value="wordListString"
          placeholder="请粘贴单词表"
          :auto-size="{ minRows: 5, maxRows: 5 }"
          style="width: 100%;"
        />
        <a-button type="primary" @click="parseWordList">解析</a-button>
        <a-button @click="addCard">添加单词</a-button>
        <a-button type="primary" @click="exportData">导出json</a-button>
        <a-button @click="addTempData">添加至临时数据</a-button>
        <p style="margin-top: 8px">提示: 导出后请自行上传</p>
      </a-col>
      <a-col class="right" flex="auto">
        <!-- 内容表格 -->
        <a-table 
          class="table" 
          :columns="columns" 
          :data-source="dataSource" 
          bordered 
          :pagination="false"
          ref="tableRef"
          >
          <template #bodyCell="{ column, text, index }">
            <template v-if="column.dataIndex === 'operation'">
              <div class="editable-row-operations">
                <span v-if="editableData[index]">
                  <a-typography-link @click="tableSave(index)" style="margin-right: 2px;">保存</a-typography-link>
                  <a-popconfirm title="放弃更改?" @confirm="tableCancel(index)">
                    <a>取消</a>
                  </a-popconfirm>
                </span>
                <span v-else>
                  <a @click="tableEdit(index)" style="margin-right: 2px;">编辑</a>
                  <a-popconfirm title="确定删除?" @confirm="tableDel(index)">
                    <a style="color: red;">删除</a>
                  </a-popconfirm>
                </span>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'index'">{{ index+1 }}</template>
            <template v-else>
              <div>
                <a-input
                  v-if="editableData[index]"
                  v-model:value="editableData[index][column.dataIndex]"
                  style="margin: -5px 0"
                />
                <template v-else>
                  {{ text }}
                </template>
              </div>
            </template>
          </template>
        </a-table>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from 'vue';
import { message, Modal, Button } from 'ant-design-vue';
import * as wordTool from '../../utils/wordTool';
import { addTempQuestion } from '../../questions';

const wordListString = ref(''); // 单词表字符串
const dataSource = ref<wordTool.Word[]>([]); // 单词表

const parseWordList = () => {
  if (!wordListString.value) {
    message.error('请输入单词表');
    return;
  }
  // 解析单词表
  dataSource.value = wordTool.parseWordList(wordListString.value)
  if (!dataSource.value.length) {
    message.error('解析失败');
    return;
  }
  message.success('解析成功')
}
const toQues = (dataSource: wordTool.Word[]) => { 
  // @ts-ignore
  const res = [] 
  dataSource.forEach((item) => {
    res.push({
      q: item.word,
      ans: item.chinese,
      con: item.pronounce,
    })
  })
  // @ts-ignore
  return res
}
const exportData = () => {
  if (!dataSource.value.length) {
    message.error('请解析单词表');
    return;
  }
  // 转换格式
  const data = toQues(dataSource.value)
  // 导出json
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'wordList.json';
  // 导出json
  // Modal 
  const modal = Modal.success({
    title: '导出成功',
    content: '点击下载按钮下载json',
    footer: ()=> h('div', {style: 'display: flex; flex-direction: row-reverse;'}, [
      h(Button, { type: 'primary', onClick: () => {
        link.click();
        URL.revokeObjectURL(url);
        modal.destroy();
      } }, { default: () => '下载' }),
      h(Button, { style: 'margin-right: 8px;', onClick: () => {
        modal.destroy();
      } }, { default: () => '取消' }),
    ]),
  });
}

const addTempData = () => {
  if (!dataSource.value.length) {
    message.error('请解析单词表');
    return;
  }
  // 弹框让用户输入一个题库名称
  Modal.confirm({
    title: '请输入题库名称',
    content: h('input', {
      id: 'tempDataName',
      placeholder: '请输入题库名称',
      style: 'width: 100%;'
    }),
    onOk() {
      const tempDataName = document.getElementById('tempDataName') as HTMLInputElement;
      if (!tempDataName.value) {
        message.error('请输入题库名称');
        return;
      }
      // 添加至临时数据
      addTempQuestion(tempDataName.value, toQues(dataSource.value))
      message.success('添加成功')
    },
  });
}
// 关于表格
const columns = [
  { title: '#', dataIndex: 'index', width: '10%' },
  { title: '单词', dataIndex: 'word' },
  { title: '中文', dataIndex: 'chinese' },
  { title: '音标', dataIndex: 'pronounce' },
  { title: '', dataIndex: 'operation' },
];
const tableRef = ref();
const editableData = reactive<any>({});
const cloneDeep = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
}
const tableEdit = (key: number) => {
  editableData[key] = cloneDeep(dataSource.value[key]);
};
const tableSave = (key: number) => {
  Object.assign(dataSource.value[key], editableData[key]);
  delete editableData[key];
};
const tableCancel = (key: number) => {
  delete editableData[key];
};
const tableDel = (key: number) => {
  dataSource.value.splice(key, 1)
  // 删除编辑
  delete editableData[key]
};
const addCard = () => {
  dataSource.value.push({
    word: '',
    chinese: '',
    pronounce: '',
  })
  // 编辑
  tableEdit(dataSource.value.length-1)
  // 滚动条到底部
  const dom = tableRef.value.$el
  requestAnimationFrame(() => {
    dom.scrollTo(0, dom.scrollHeight)
  })
}

</script>

<style scoped>
#wordTool {
  height: 100%;
  width: 100%;
  min-height: var(--content-min-height);
}
.start {
  flex-wrap: nowrap;
}

.left {
  height: 100%;
  width: 100%;
  max-width: 355px;
  background-color: #fff;
  min-height: var(--content-min-height);
  /* 右侧边框 */
  border-right: 1px solid #e8e8e8;
}
.left .ant-btn {
  margin-top: 8px;
  margin-right: 8px;
}

.right {
  height: 100%;
  width: 100%;
  background-color: #fff;
  min-height: var(--content-min-height);
}
.table {
  height: var(--content-min-height);
  width: 100%;
  background-color: #fff;
  overflow-y: auto;
}

/* 媒体查询，当屏幕宽度小于600px时，将布局改为上下排列 */
@media (max-width: 750px) {
  .start {
    flex-wrap: wrap;
  }
  .left, .right {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e8e8e8;
    min-width: 100%;

  }
}
</style>
