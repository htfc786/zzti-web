// cdn配置
export default {
  // prodUrl: 'https://unpkg.com/{name}@{version}/{path}', // unpkgCDN
  prodUrl: 'https://cdn.bootcdn.net/ajax/libs/{name}/{version}/{path}',
  modules: [
    {
      name: 'vue',
      var: 'Vue',
      path: 'vue.global.prod.min.js',
    },
    {
      name: 'vue-router',
      var: 'VueRouter',
      path: 'vue-router.global.prod.min.js',
    },
    // 配置dayjs及其插件
    // 这是 ant-design-vue 需要的 https://www.antdv.com/docs/vue/introduce-cn/#浏览器引入
    { name: 'dayjs', var: 'dayjs', path: 'https://unpkg.com/dayjs/dayjs.min.js', },
    { name: 'customParseFormat', var: 'customParseFormat', path: 'https://unpkg.com/dayjs/plugin/customParseFormat.js', },
    { name: 'weekday', var: 'weekday', path: 'https://unpkg.com/dayjs/plugin/weekday.js', },
    { name: 'localeData', var: 'localeData', path: 'https://unpkg.com/dayjs/plugin/localeData.js', },
    { name: 'weekOfYear', var: 'weekOfYear', path: 'https://unpkg.com/dayjs/plugin/weekOfYear.js', },
    { name: 'weekYear', var: 'weekYear', path: 'https://unpkg.com/dayjs/plugin/weekYear.js', },
    { name: 'advancedFormat', var: 'advancedFormat', path: 'https://unpkg.com/dayjs/plugin/advancedFormat.js', },
    { name: 'quarterOfYear', var: 'quarterOfYear', path: 'https://unpkg.com/dayjs/plugin/quarterOfYear.js', },
    {
      name: 'ant-design-vue',
      var: 'antd',
      path: 'antd.min.js',
      css: 'reset.min.css',
    },
    {
      name: 'vue-demi',
      var: 'VueDemi',
      // package.json中并未包含该库，是pinia要求的，故手动指定版本
      path: 'https://cdn.bootcdn.net/ajax/libs/vue-demi/0.14.6/index.iife.min.js',
    },
    {
      name: 'pinia',
      var: 'Pinia',
      path: 'pinia.iife.prod.min.js',
    },
    // {
    //   name: 'pinia-plugin-persistedstate',
    //   var: 'createPersistedState()',
    //   path: 'https://unpkg.com/pinia-plugin-persistedstate/dist/index.mjs'
    // },
  ]
}
