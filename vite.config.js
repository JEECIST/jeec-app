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
    VitePWA({
      strategies: 'injectManifest', // THIS IS CRUCIAL: It tells Vite to use your existing sw.js
      srcDir: 'public', // Or 'src' depending on where your sw.js lives
      filename: 'sw.js', // The name of your existing service worker
      registerType: 'autoUpdate',
      injectManifest: {
        injectionPoint: 'self.__WB_MANIFEST',
      },
      manifest: {
        name: 'JEEC Student App',
        short_name: 'JEEC',
        description: 'Empower your future with JEEC',
        theme_color: '#08111a', // Matches your dark background
        background_color: '#08111a',
        display: 'standalone', // This is what makes it open like a real app!
        icons: [
          {
            src: '/img/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/img/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
