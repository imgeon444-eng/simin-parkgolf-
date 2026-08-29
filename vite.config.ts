import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // GitHub Pages 및 어떤 호스팅에서도 정적 자산 경로 완벽 호환
  server: {
    port: 3000,
    open: true
  }
});
