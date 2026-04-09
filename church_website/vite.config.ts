import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  css: {
    devSourcemap: false,
  },
  server: {
    port: 5175,
    strictPort: false,
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
