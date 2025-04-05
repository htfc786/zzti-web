<template>{{ zk }}</template>

<script setup lang="ts">
import { ref } from 'vue';

const zk = ref();

// 中考日期
// (6-1)是因为Date的月份默认是从0开始到11结束的
// 改月份改前面那个数字就行了
//2024, (6-1), 15, 9, 0, 0
//  年，月-1 ，日，时，分，秒
const zkDate = new Date(2027, (6-1), 7, 0, 0, 0)
// 提示
const tstextBefor = "距离2027天津高考还有 "

setInterval(function (){
  let nowDate = new Date();
  let seconds = Math.floor((zkDate.getTime() - nowDate.getTime()) / 1000);
  // 1 天 - 时 - 分 - 秒
  let temp = seconds
  let day =  Math.floor(temp / (60 * 60 * 24))
  temp = temp - day * 60 * 60 * 24
  let hour =  Math.floor(temp / (60 * 60))
  temp = temp - hour * 60 * 60
  let minute =  Math.floor(temp / (60))
  temp = temp - minute * 60
  let second =  Math.floor(temp)
  let res1 = `${day}天${hour}小时${minute}分钟${second}秒`
  // 2 时 - 分 - 秒
  let hour2 =  Math.floor(seconds / (60 * 60))
  // let res2 = `${hour2}小时${minute}分钟${second}秒`
  // 3 秒
  // let res3 = `${seconds}秒`
  let resall = `${res1}` //`${res1}(${res2})(${res3})`
  
  if (hour2 >= 0) {
    zk.value = tstextBefor + resall
  }  else {
    zk.value = ""
  }
}, 1000)

</script>

<style scoped></style>
  