import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { Plugin as importToCDN } from 'vite-plugin-cdn-import'
import CDNConfig from './cdnconfig'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    importToCDN(CDNConfig),
  ],
  base: './', // 这里更改打包相对绝对路径
})
