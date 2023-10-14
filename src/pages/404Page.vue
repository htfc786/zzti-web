<template>
  <a-result status="404" title="404" sub-title="当前页面不存在！" />
</template>

<script setup lang="ts"></script>

<style scoped>
.ant-result {
  padding: 16px 32px !important;
}

/* 夜间模式样式 */
.dark .ant-result :deep(.ant-result-title) {
  color: rgba(255, 255, 255, 0.88);
}
.dark .ant-result :deep(.ant-result-subtitle) {
  color: rgba(255, 255, 255, 0.45);
}
</style>
