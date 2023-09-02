<template>{{ zk }}</template>

<script setup lang="ts">
import { ref } from 'vue';

const zk = ref();

// 中考日期
// (6-1)是因为Date的月份默认是从0开始到11结束的
// 改月份改前面那个数字就行了
//2024, (6-1), 15, 9, 0, 0
//  年，月-1 ，日，时，分，秒
const zkDate = new Date(2024, (6-1), 15, 9, 0, 0)
// 中考天数
// 一般中考不都考1坤天（2天半）吗
const zkDays = 2.125 // (2.5*24-9)/24
// 提示
const tstextBefor = "距离中考还有 "
const tstextAfter = "中考已经开始 "

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
  } else if (hour2 < 0 && hour2 >= -(zkDays * 24)) {
    zk.value = tstextAfter + resall+(zkDays * 24)
  } else if (hour2 < -(zkDays * 24)) {
    zk.value = "" + resall
  }
}, 1000)

</script>

<style scoped></style>
  