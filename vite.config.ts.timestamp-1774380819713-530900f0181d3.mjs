// vite.config.ts
import { defineConfig } from "file:///F:/panku%20app/node_modules/vite/dist/node/index.js";
import react from "file:///F:/panku%20app/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwindcss from "file:///F:/panku%20app/node_modules/@tailwindcss/vite/dist/index.mjs";
import { VitePWA } from "file:///F:/panku%20app/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "Assets/favicon.png",
        "Assets/icon-darkbg.png",
        "Assets/icon-lightbg.png",
        "Assets/logo-darkbg.png",
        "Assets/logo-lightbg.png"
      ],
      manifest: {
        name: "Panku App",
        short_name: "Panku",
        description: "Split group expenses easily. Track who paid what and instantly calculate who owes whom.",
        theme_color: "#1CE8B7",
        background_color: "#0B0F14",
        display: "standalone",
        start_url: "/",
        scope: "/",
        orientation: "portrait",
        categories: ["finance", "utilities"],
        screenshots: [
          {
            src: "Screenshots/dashboard.jpeg",
            sizes: "1080x2340",
            type: "image/jpeg",
            form_factor: "narrow"
          },
          {
            src: "Screenshots/expenses.jpeg",
            sizes: "1080x2340",
            type: "image/jpeg",
            form_factor: "narrow"
          },
          {
            src: "Screenshots/summary.jpeg",
            sizes: "1080x2340",
            type: "image/jpeg",
            form_factor: "narrow"
          },
          {
            src: "Screenshots/report.jpeg",
            sizes: "1080x2340",
            type: "image/jpeg",
            form_factor: "narrow"
          }
        ],
        icons: [
          {
            src: "Assets/icon-darkbg.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "Assets/icon-darkbg.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "Assets/icon-darkbg.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        // Cache strategies
        runtimeCaching: [
          {
            // Cache the app shell (HTML, JS, CSS)
            urlPattern: /^https?:\/\/.*\/(assets|src)\//,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "app-shell-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30
                // 30 days
              }
            }
          },
          {
            // Cache images with CacheFirst
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 60
                // 60 days
              }
            }
          }
        ],
        // Pre-cache all static assets built by Vite
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"]
      },
      devOptions: {
        enabled: true
        // Enable PWA in dev mode for testing
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxwYW5rdSBhcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkY6XFxcXHBhbmt1IGFwcFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRjovcGFua3UlMjBhcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ0B0YWlsd2luZGNzcy92aXRlJ1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgdGFpbHdpbmRjc3MoKSxcbiAgICBWaXRlUFdBKHtcbiAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxuICAgICAgaW5jbHVkZUFzc2V0czogW1xuICAgICAgICAnQXNzZXRzL2Zhdmljb24ucG5nJyxcbiAgICAgICAgJ0Fzc2V0cy9pY29uLWRhcmtiZy5wbmcnLFxuICAgICAgICAnQXNzZXRzL2ljb24tbGlnaHRiZy5wbmcnLFxuICAgICAgICAnQXNzZXRzL2xvZ28tZGFya2JnLnBuZycsXG4gICAgICAgICdBc3NldHMvbG9nby1saWdodGJnLnBuZycsXG4gICAgICBdLFxuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgbmFtZTogJ1Bhbmt1IEFwcCcsXG4gICAgICAgIHNob3J0X25hbWU6ICdQYW5rdScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnU3BsaXQgZ3JvdXAgZXhwZW5zZXMgZWFzaWx5LiBUcmFjayB3aG8gcGFpZCB3aGF0IGFuZCBpbnN0YW50bHkgY2FsY3VsYXRlIHdobyBvd2VzIHdob20uJyxcbiAgICAgICAgdGhlbWVfY29sb3I6ICcjMUNFOEI3JyxcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyMwQjBGMTQnLFxuICAgICAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXG4gICAgICAgIHN0YXJ0X3VybDogJy8nLFxuICAgICAgICBzY29wZTogJy8nLFxuICAgICAgICBvcmllbnRhdGlvbjogJ3BvcnRyYWl0JyxcbiAgICAgICAgY2F0ZWdvcmllczogWydmaW5hbmNlJywgJ3V0aWxpdGllcyddLFxuICAgICAgICBzY3JlZW5zaG90czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJ1NjcmVlbnNob3RzL2Rhc2hib2FyZC5qcGVnJyxcbiAgICAgICAgICAgIHNpemVzOiAnMTA4MHgyMzQwJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9qcGVnJyxcbiAgICAgICAgICAgIGZvcm1fZmFjdG9yOiAnbmFycm93J1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnU2NyZWVuc2hvdHMvZXhwZW5zZXMuanBlZycsXG4gICAgICAgICAgICBzaXplczogJzEwODB4MjM0MCcsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvanBlZycsXG4gICAgICAgICAgICBmb3JtX2ZhY3RvcjogJ25hcnJvdydcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJ1NjcmVlbnNob3RzL3N1bW1hcnkuanBlZycsXG4gICAgICAgICAgICBzaXplczogJzEwODB4MjM0MCcsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvanBlZycsXG4gICAgICAgICAgICBmb3JtX2ZhY3RvcjogJ25hcnJvdydcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJ1NjcmVlbnNob3RzL3JlcG9ydC5qcGVnJyxcbiAgICAgICAgICAgIHNpemVzOiAnMTA4MHgyMzQwJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9qcGVnJyxcbiAgICAgICAgICAgIGZvcm1fZmFjdG9yOiAnbmFycm93J1xuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICdBc3NldHMvaWNvbi1kYXJrYmcucG5nJyxcbiAgICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgIHB1cnBvc2U6ICdhbnknXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICdBc3NldHMvaWNvbi1kYXJrYmcucG5nJyxcbiAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgIHB1cnBvc2U6ICdhbnknXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICdBc3NldHMvaWNvbi1kYXJrYmcucG5nJyxcbiAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgIHB1cnBvc2U6ICdtYXNrYWJsZSdcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB3b3JrYm94OiB7XG4gICAgICAgIC8vIENhY2hlIHN0cmF0ZWdpZXNcbiAgICAgICAgcnVudGltZUNhY2hpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAvLyBDYWNoZSB0aGUgYXBwIHNoZWxsIChIVE1MLCBKUywgQ1NTKVxuICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwcz86XFwvXFwvLipcXC8oYXNzZXRzfHNyYylcXC8vLFxuICAgICAgICAgICAgaGFuZGxlcjogJ1N0YWxlV2hpbGVSZXZhbGlkYXRlJyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiAnYXBwLXNoZWxsLWNhY2hlJyxcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgICAgIG1heEVudHJpZXM6IDUwLFxuICAgICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDMwLCAvLyAzMCBkYXlzXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgLy8gQ2FjaGUgaW1hZ2VzIHdpdGggQ2FjaGVGaXJzdFxuICAgICAgICAgICAgdXJsUGF0dGVybjogL1xcLig/OnBuZ3xqcGd8anBlZ3xzdmd8Z2lmfHdlYnB8aWNvKSQvLFxuICAgICAgICAgICAgaGFuZGxlcjogJ0NhY2hlRmlyc3QnLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICBjYWNoZU5hbWU6ICdpbWFnZS1jYWNoZScsXG4gICAgICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAgICAgICAgICAgICBtYXhFbnRyaWVzOiAzMCxcbiAgICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiA2MCwgLy8gNjAgZGF5c1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICAvLyBQcmUtY2FjaGUgYWxsIHN0YXRpYyBhc3NldHMgYnVpbHQgYnkgVml0ZVxuICAgICAgICBnbG9iUGF0dGVybnM6IFsnKiovKi57anMsY3NzLGh0bWwsaWNvLHBuZyxzdmcsd29mZjJ9J10sXG4gICAgICB9LFxuICAgICAgZGV2T3B0aW9uczoge1xuICAgICAgICBlbmFibGVkOiB0cnVlLCAvLyBFbmFibGUgUFdBIGluIGRldiBtb2RlIGZvciB0ZXN0aW5n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
