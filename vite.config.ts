import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { componentTagger } from 'lovable-tagger';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  server: {
    port: 8080,
    host: '::',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
  build: {
    outDir: 'dist',
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  plugins: [
    react(),
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['ninja-favicon.svg', 'robots.txt'],
      manifest: {
        name: 'MA Studios - Digital Portfolio',
        short_name: 'MA Studios',
        description: 'Cyberpunk-styled portfolio and project showcase platform',
        theme_color: '#00f0ff',
        background_color: '#0a0a0f',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
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
  ],
});
