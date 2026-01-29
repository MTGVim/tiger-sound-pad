import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [react(),  VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'My App',
      short_name: 'App',
      description: 'My PWA App',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      // Workbox options
      globPatterns: ['**/*.{js,css,html,ico,png,svg}']
    }
  })],
  base: "tiger-sound-pad",
  server: {
    port: 3000,
  },
});
