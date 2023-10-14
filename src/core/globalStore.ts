import { defineStore } from "pinia";

export const globalStore = defineStore("zzti_globalStore", {
  state: () => {
    //数据
    return {
      history: {
        mode: "path",
        data: <Array<Array<string | null>> | null>null
      },
      dark_mode: false, 
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