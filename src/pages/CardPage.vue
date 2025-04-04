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
          >
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'operation'">
              <div class="editable-row-operations">
                <span v-if="editableData[record.key]">
                  <a-typography-link @click="tableSave(record.key)" style="margin-right: 2px;">保存</a-typography-link>
                  <a-popconfirm title="放弃更改?" @confirm="tableCancel(record.key)">
                    <a>取消</a>
                  </a-popconfirm>
                </span>
                <span v-else>
                  <a @click="tableEdit(record.key)">编辑</a>
                </span>
              </div>
            </template>
            <template v-else>
              <div>
                <a-input
                  v-if="editableData[record.key]"
                  v-model:value="editableData[record.key][column.dataIndex]"
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
            <a-button>添加信息</a-button>
          </a-row>
          <a-row>正面：
            字号：<a-input-number size="small" :min="1" :max="100" v-model:value="config.front.fontSize" />
            字色：<a-select size="small" v-model:value="config.front.color">
              <a-select-option value="black">黑</a-select-option>
              <a-select-option value="grey">灰</a-select-option>
              <a-select-option value="red">红</a-select-option>
              <a-select-option value="blue">蓝</a-select-option>
            </a-select>
          </a-row>
          <a-row>反面：
            字号：<a-input-number size="small" :min="1" :max="100" v-model:value="config.back.fontSize" />
            字色：<a-select size="small" v-model:value="config.back.color">
              <a-select-option value="black">黑</a-select-option>
              <a-select-option value="grey">灰</a-select-option>
              <a-select-option value="red">红</a-select-option>
              <a-select-option value="blue">蓝</a-select-option>
            </a-select>
          </a-row>
          <a-row>备注：
            字号：<a-input-number size="small" :min="1" :max="100" v-model:value="config.content.fontSize" />
            字色：<a-select size="small" v-model:value="config.content.color">
              <a-select-option value="black">黑</a-select-option>
              <a-select-option value="grey">灰</a-select-option>
              <a-select-option value="red">红</a-select-option>
              <a-select-option value="blue">蓝</a-select-option>
            </a-select>
          </a-row>
          <a-row>页面配置：
            纸张：<a-select size="small" v-model:value="config.paper.size">
              <a-select-option value="horizontal">A4(横)</a-select-option>
              <a-select-option value="vertical">A4(竖)</a-select-option>
            </a-select>
            个数：<a-input-number size="small" :min="1" :max="100" style="width: 50px;" v-model:value="config.paper.count.x" /> 
            X <a-input-number size="small" :min="1" :max="100" style="width: 50px;" v-model:value="config.paper.count.y" />
          </a-row>
          <a-row type="flex" justify="end">
            <a-button type="primary" @click="generateCard">生成卡片</a-button>
          </a-row>
        </div>
      </a-col>
      <a-col class="right" :span="12">
        <!-- 卡片展示 -->
        <a-list size="small" bordered :data-source="data" class="card-list">
          <template #renderItem="{ item }">
            <a-list-item>
              第{{ item.key }}张
              <a-image
                :width="200"
                src="https://aliyuncdn.antdv.com/vue.png"
              />
            </a-list-item>
          </template>
        </a-list>
        <a-row type="flex" justify="end">
          <a-button type="primary" @click="">导出PDF</a-button>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue'
import { ref, onMounted, reactive } from 'vue'
const contentHeight = ref(0)
onMounted(() => {
  // 获取页面高度
  const dom = document.getElementById('CardPage')!
  contentHeight.value = dom.clientHeight
  const resize = () => {
    contentHeight.value = dom.clientHeight
  }
  window.addEventListener('resize', resize)
  onUnmounted(() => {
    window.removeEventListener('resize', resize)
  })
})
// 关于表格
const columns = [
  { title: '#', dataIndex: 'key', width: '10%' },
  { title: '正面', dataIndex: 'front' },
  { title: '反面', dataIndex: 'back' },
  { title: '备注', dataIndex: 'content' },
  { title: '', dataIndex: 'operation' },
];
const editableData = reactive<any>({});
const cloneDeep = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
}
const tableEdit = (key: number) => {
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
};
const tableSave = (key: number) => {
  Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
  delete editableData[key];
};
const tableCancel = (key: number) => {
  delete editableData[key];
};
// 参数设置
const config = ref({
  front: { fontSize: 12, color: 'black' },
  back: { fontSize: 12, color: 'black' },
  content: { fontSize: 12, color: 'grey' },
  paper: { size: 'horizontal', count: { x: 1, y: 1 } },
});
// 生成卡片
const generateCard = () => {
  // TODO: 生成卡片
}

const data = [
  { front: '正面', back: '反面', content: '备注',},
  { front: '正面', back: '反面', content: '备注',},
  { front: '正面', back: '反面',},
  { front: '正面', back: '反面', },{ front: '正面', back: '反面', },{ front: '正面', back: '反面', },{ front: '正面', back: '反面', },{ front: '正面', back: '反面', },{ front: '正面', back: '反面', },{ front: '正面', back: '反面', },{ front: '正面', back: '反面', },
]

const dataSource = ref(data.map((item, index) => ({ ...item, key: index+1 })));
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
  height: calc(var(--content-min-height) - 40px);
  width: 100%;
  background-color: #fff;
  overflow-y: auto;
}

/* 媒体查询，当屏幕宽度小于600px时，将布局改为上下排列 */
@media (max-width: 600px) {
  .left, .right {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e8e8e8;
    min-width: 100%;

  }
}
</style>
