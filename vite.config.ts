import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/hglGameEditor/', // 设置为相对路径，适用于GitHub Pages部署
})
