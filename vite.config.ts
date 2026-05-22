import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_ACTIONS === 'true' ? '/Liburary_Management_System/' : 'https://library.sdu.kz/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
      proxy: {
        '/api': {
          target: 'https://5879-109-175-215-60.ngrok-free.app',
          changeOrigin: true,
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },

        },
        '/images': {
          target: 'https://5879-109-175-215-60.ngrok-free.app',
          changeOrigin: true,
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },

        },
      },
    },
})
