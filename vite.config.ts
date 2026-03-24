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
      includeAssets: [
        'Assets/favicon.png',
        'Assets/icon-darkbg.png',
        'Assets/icon-lightbg.png',
        'Assets/logo-darkbg.png',
        'Assets/logo-lightbg.png',
      ],
      manifest: {
        name: 'Panku App',
        short_name: 'Panku',
        description: 'Split group expenses easily. Track who paid what and instantly calculate who owes whom.',
        theme_color: '#1CE8B7',
        background_color: '#0B0F14',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'portrait',
        categories: ['finance', 'utilities'],
        screenshots: [
          {
            src: 'Screenshots/dashboard.jpeg',
            sizes: '1080x2340',
            type: 'image/jpeg',
            form_factor: 'narrow'
          },
          {
            src: 'Screenshots/expenses.jpeg',
            sizes: '1080x2340',
            type: 'image/jpeg',
            form_factor: 'narrow'
          },
          {
            src: 'Screenshots/summary.jpeg',
            sizes: '1080x2340',
            type: 'image/jpeg',
            form_factor: 'narrow'
          },
          {
            src: 'Screenshots/report.jpeg',
            sizes: '1080x2340',
            type: 'image/jpeg',
            form_factor: 'narrow'
          }
        ],
        icons: [
          {
            src: 'Assets/icon-darkbg.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'Assets/icon-darkbg.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'Assets/icon-darkbg.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // Cache strategies
        runtimeCaching: [
          {
            // Cache the app shell (HTML, JS, CSS)
            urlPattern: /^https?:\/\/.*\/(assets|src)\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'app-shell-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            // Cache images with CacheFirst
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 60, // 60 days
              },
            },
          },
        ],
        // Pre-cache all static assets built by Vite
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      devOptions: {
        enabled: true, // Enable PWA in dev mode for testing
      },
    })
  ],
})
