import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/favicon.png', 'assets/logo-darkbg.png', 'assets/logo-lightbg.png'],
      manifest: {
        name: 'Panku App',
        short_name: 'Panku',
        description: 'Split expenses, stay friends.',
        theme_color: '#05080c',
        icons: [
          {
            src: 'assets/icon-darkbg.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
             src: 'assets/icon-darkbg.png',
             sizes: '192x192',
             type: 'image/png'
          }
        ]
      }
    })
  ],
})
