import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import fs from 'fs';
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: 'localhost',
    port: 3000,
    https: {
      key: fs.readFileSync('./cert/localhost+1-key.pem'),
      cert: fs.readFileSync('./cert/localhost+1.pem')
    },
    cors: true,
    proxy: {
      '/api': {
        target: 'https://localhost:443',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  }
})
