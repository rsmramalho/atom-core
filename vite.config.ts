/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "favicon.ico", "pwa-icons/*.png"],
      manifest: {
        name: "MindMate - Atom Engine",
        short_name: "MindMate",
        description: "Sistema de produtividade pessoal com rituais, hábitos e projetos",
        theme_color: "#111318",
        background_color: "#111318",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/pwa-icons/icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/pwa-icons/icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/pwa-icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/pwa-icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/pwa-icons/icon-152x152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "/pwa-icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/pwa-icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
  },
}));
