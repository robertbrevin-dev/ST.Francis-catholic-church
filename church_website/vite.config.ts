import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  css: {
    devSourcemap: false,
  },
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  server: {
    host: "127.0.0.1",
    port: 5175,
    strictPort: false,
    hmr: {
      protocol: "ws",
      host: "127.0.0.1",
      port: 5175,
      clientPort: 5175,
    },
    proxy: {
      "/api/usccb-rss": {
        target: "https://www.usccb.org",
        changeOrigin: true,
        rewrite: () => "/bible/readings/rss/index.cfm",
        secure: true,
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['@supabase/supabase-js', '@supabase/gotrue-js'],
  },

  assetsInclude: ['**/*.svg', '**/*.csv'],
})
