<template>
  <div class="font-resize">
    {{ props.title }}
    <a-tooltip title="放大">
      <a-button type="primary" @click="add()" shape="circle" :icon="h(PlusOutlined)" />
    </a-tooltip>
    <a-tooltip title="缩小">
      <a-button type="primary" @click="reduce()" shape="circle" :icon="h(MinusOutlined)" />
    </a-tooltip>
    <a-tooltip title="重置">
      <a-button shape="circle" @click="reset()" :icon="h(RedoOutlined)" />
    </a-tooltip>
    <a-input-number v-model:value="valueIn" :min="props.min" :max="props.max" />
  </div>
</template>

<script setup lang="ts">
import { h, ref, watch } from 'vue';
import { PlusOutlined, MinusOutlined, RedoOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  title: { type: String, default: "字体大小:" },
  min: { type: Number, default: 20 },
  max: { type: Number, default: 120 },
  default: { type: Number, default: 40 },
  step: { type: Number, default: 10 },
  value: { type: Number, required: true },
});

const emit = defineEmits(['update:value']);

const valueIn = ref(props.value);

watch(valueIn, () => {
  emit('update:value', valueIn.value)
});

const add = () => {
  const add_r = valueIn.value + props.step;
  if (add_r >= props.max) {
    valueIn.value = props.max
    return;
  }
  valueIn.value = add_r
};

const reduce = () => {
  const reduce_r = valueIn.value - props.step;
  if (reduce_r <= props.min) {
    valueIn.value = props.min
    return;
  }
  valueIn.value = reduce_r
};

const reset = () => {
  valueIn.value = props.default
};

</script>

<style scoped>
.font-resize {
  font-size: 14px;
}
.font-resize .ant-btn {
  margin-right: 8px;
}
</style>
