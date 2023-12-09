import { defineStore } from "pinia";

export const globalStore = defineStore("zzti_globalStore", {
  state: () => {
    //数据
    return {
      history: {
        data: <Array<Array<string | null>> | null>null
      },
      dark_mode: false, 
      oneQuesMode: <string>"null"
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