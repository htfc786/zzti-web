import { defineStore } from "pinia";

export const globalStore = defineStore("saveLevel", {
  state: () => {
    //数据
    return {
      savePathList_treeValue: ['\\'],
    };
  },
  actions: {
    readSavePath() {
      
    },
  },
  persist: {
    //存储位置
    key: "zzti_globalStore",
    storage: window.localStorage,
  },
});