import { fileURLToPath, URL } from 'node:url'
import svgPlugin from './plugins/svgInject'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import mock from './mock/index'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [mock(), vue(), svgPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@img': fileURLToPath(new URL('./src/assets/images', import.meta.url)),
    },
  },
  server: {
    port: 5175,
    proxy: {
      '^/(api|cdn)': {
        target: 'http://mgt.beta.rakuno1.com',
        changeOrigin: true,
      },
    },
  },
})
