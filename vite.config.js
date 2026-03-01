import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // vueDevTools(),
    // visualizer({
    //   open: true,         // Abre o relatório automaticamente no teu browser
    //   filename: 'stats.html', // O nome do ficheiro que será gerado
    //   gzipSize: true,     // Mostra o tamanho real dos ficheiros após a compressão GZIP (muito importante para teres a noção real)
    //   brotliSize: true,   // Outro formato de compressão comum
    // }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
