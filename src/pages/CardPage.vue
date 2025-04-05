<template>
  <div id="CardPage">
    <a-row type="flex">
      <a-col class="left" :span="12">
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
        <!-- 配置信息 -->
        <div class="config" style="line-height: 24px;">
          <a-row>
            <a-button type="primary" @click="importData">导入数据</a-button>
            <a-button @click="addCard">添加信息</a-button>
          </a-row>
          <a-row>正面：
            字号：<a-select size="small" v-model:value="config.front.fontSize" :options="fontSizeOptions"></a-select>
            字色：<a-select size="small" v-model:value="config.front.color" :options="fontColorOptions"></a-select>
          </a-row>
          <a-row>反面：
            字号：<a-select size="small" v-model:value="config.back.fontSize" :options="fontSizeOptions"></a-select>
            字色：<a-select size="small" v-model:value="config.back.color" :options="fontColorOptions"></a-select>
          </a-row>
          <a-row>备注：
            字号：<a-select size="small" v-model:value="config.content.fontSize" :options="fontSizeOptions"></a-select>
            字色：<a-select size="small" v-model:value="config.content.color" :options="fontColorOptions"></a-select>
            位置：<a-select size="small" v-model:value="config.paper.contentPosition" :options="contentPositionOptions"></a-select>
          </a-row>
          <a-row>页面配置：
            纸张：<a-select size="small" v-model:value="config.paper.size" :options="paperSizeOptions"></a-select>
            个数：<a-input-number size="small" :min="1" :max="100" style="width: 50px;" v-model:value="config.paper.count.x" /> 
            X <a-input-number size="small" :min="1" :max="100" style="width: 50px;" v-model:value="config.paper.count.y" />
          </a-row>
          <a-row type="flex" justify="space-between">
            <a-col>
              卡片页码：<a-switch v-model:checked="config.paper.showCardNum" />
              页码：<a-switch v-model:checked="config.paper.showPageNum" />
            </a-col>
            <a-button style="margin-left: 8px;" type="primary" @click="generateCard">生成卡片</a-button>
          </a-row>
        </div>
      </a-col>
      <a-col class="right" :span="12">
        <!-- 卡片展示 -->
        <a-list size="small" bordered :data-source="paperImageData" class="card-list">
          <template #renderItem="{ item, index }">
            <a-list-item>
              第{{ index+1 }}张
              <a-image
                :width="200"
                :src="item"
              />
            </a-list-item>
          </template>
        </a-list>
        <!-- 进度条 -->
        <a-row type="flex" justify="start">
          <a-progress :percent="generateProgress" style="margin-left: 16px;" />
        </a-row>
        <a-row type="flex" justify="end">
          <a-button type="primary" @click="createPdf">导出PDF</a-button>
        </a-row>
      </a-col>
    </a-row>
    <a-modal v-model:open="importModalVisible" title="导入数据" @ok="importModalOk" @cancel="importModalCancel">
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
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import { message, Modal, Button, TreeSelect } from 'ant-design-vue'
import type { TreeSelectProps } from 'ant-design-vue'
import * as cardTools from '../core/card'
import { getTreeDataByQues, getPathListByTreeValueList } from '../core/questions'
import { getQuestionByPathList } from '../questions'

// 关于表格
const columns = [
  { title: '#', dataIndex: 'index', width: '10%' },
  { title: '正面', dataIndex: 'front' },
  { title: '反面', dataIndex: 'back' },
  { title: '备注', dataIndex: 'content' },
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
    front: '',
    back: '',
    content: '',
  })
  // 编辑
  tableEdit(dataSource.value.length-1)
  // 滚动条到底部
  const dom = tableRef.value.$el
  requestAnimationFrame(() => {
    dom.scrollTo(0, dom.scrollHeight)
  })
}
// 参数设置
const fontSizeOptions = [
  { label: 'h1', value: 'h1' },
  { label: 'h2', value: 'h2' },
  { label: 'h3', value: 'h3' },
  { label: 'h4', value: 'h4' },
  { label: 'h5', value: 'h5' },
  { label: 'h6', value: 'h6' }
]
const fontColorOptions = [
  { label: '黑', value: 'black' },
  { label: '灰', value: 'grey' },
  { label: '红', value: 'red' },
  { label: '蓝', value: 'blue' }
]
const paperSizeOptions = [
  { label: 'A4(横)', value: 'horizontal' },
  { label: 'A4(竖)', value: 'vertical' }
]
const contentPositionOptions = [
  { label: '正面', value: 'front' },
  { label: '反面', value: 'back' }
]
// 配置项
const config = ref<cardTools.cardConfig>({
  front: { fontSize: "h2", color: 'black' },
  back: { fontSize: "h3", color: 'black' },
  content: { fontSize: "h5", color: 'grey' },
  paper: { 
    size: 'horizontal', 
    count: { x: 8, y: 4 },
    contentPosition: 'front',
    showCardNum: true,
    showPageNum: true,
  },
});
// 页图像数据
const paperImageData = ref<string[]>([]);
const generateProgress = ref(0);
// 生成卡片
const generateCard = async () => {
  if (dataSource.value.length === 0) {
    message.error('请添加卡片数据')
    return;
  }
  const hide = message.loading('生成中...', 0); // 显示loading
  generateProgress.value = 0;
  // 每一张纸上应该印什么？
  const paperDataList = cardTools.createPaperData(dataSource.value, config.value)
  // 渲染纸张
  paperImageData.value = []
  for (let i = 0; i < paperDataList.length; i++) {
    const paperData = paperDataList[i];
    const img = await cardTools.createImage(paperData);
    const imgDom = document.createElement('img');
    imgDom.src = img;
    // 加入列表
    paperImageData.value.push(img);
    generateProgress.value = Math.floor((i+1) / paperDataList.length * 100);
  }
  hide(); // 关闭loading
}
const createPdf = async () => {
  if (paperImageData.value.length === 0) {
    message.error('请先生成卡片')
    return;
  }
  if (generateProgress.value !== 100) {
    message.error('卡片还未生成完成')
    return;
  }
  const hide = message.loading('导出中...', 0); // 显示loading
  const pafBlob = await cardTools.createPdf(paperImageData.value, config.value.paper)
  hide(); // 关闭loading
  // 下载提示框
  const url = URL.createObjectURL(pafBlob);
  const a = document.createElement('a');
  a.href = url;
  // Modal 
  const modal = Modal.success({
    title: '导出成功',
    content: '点击下载按钮下载卡片',
    footer: ()=> h('div', {style: 'display: flex; flex-direction: row-reverse;'}, [
      h(Button, { type: 'primary', onClick: () => {
        a.download = '卡片.pdf';
        a.click();
        modal.destroy();
      } }, { default: () => '下载' }),
      h(Button, { style: 'margin-right: 8px;', onClick: () => {
        a.target = '_blank';
        a.click();
        modal.destroy();
      } }, { default: () => '预览' }),
      h(Button, { style: 'margin-right: 8px;', onClick: () => {
        modal.destroy();
      } }, { default: () => '取消' }),
    ]),
  });
}

const dataSource = ref<cardTools.cardContent[]>([]);

// 导入数据相关
const importModalVisible = ref(false);
const treeValue = ref<Array<string>>(["\\"]) // 选择的范围
const treeData: TreeSelectProps['treeData'] = getTreeDataByQues()
const importData = () => {
  // pathList = getPathListByTreeValueList(treeValue.value)
  importModalVisible.value = true;
};
const importModalOk = () => {
  importModalVisible.value = false;
  // 获取题目
  const pathList = getPathListByTreeValueList(treeValue.value)
  const quesList = getQuestionByPathList(pathList);
  // 添加到数据源
  quesList?.forEach((ques) => {
    dataSource.value.push({     // @ts-ignore
      front: ques?.q,           // @ts-ignore
      back: ques?.ans || '',    // @ts-ignore
      content: ques?.con || '', // @ts-ignore
    })
  })
  // 清空选择
  treeValue.value = ["\\"]

};
const importModalCancel = () => {
  importModalVisible.value = false;
};
</script>

<style scoped>
#CardPage {
  height: 100%;
  width: 100%;
  background-color: #f0f2f5;
  min-height: var(--content-min-height);
}

.left {
  height: 100%;
  width: 100%;
  background-color: #fff;
  min-height: var(--content-min-height);
  /* 右侧边框 */
  border-right: 1px solid #e8e8e8;
}

.right {
  height: 100%;
  width: 100%;
  background-color: #fff;
  min-height: var(--content-min-height);
}
.table {
  height: calc(var(--content-min-height) - 160px);
  width: 100%;
  background-color: #fff;
  overflow-y: auto;
}
.card-list {
  height: calc(var(--content-min-height) - 62px);
  width: 100%;
  background-color: #fff;
  overflow-y: auto;
}

/* 媒体查询，当屏幕宽度小于600px时，将布局改为上下排列 */
@media (max-width: 750px) {
  .left, .right {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e8e8e8;
    min-width: 100%;

  }
}
</style>
