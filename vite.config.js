// vite.config.js
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    base: './',
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      target: 'es2015',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProd,
          drop_debugger: isProd,
          pure_funcs: isProd ? ['console.log', 'console.info'] : [],
        },
        output: {
          comments: false,
        },
      },
      rollupOptions: {
        output: {
          // 手动分块，将React和UI库单独打包
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'semi-vendor': ['@douyinfe/semi-ui', '@douyinfe/semi-icons'],
          },
        },
      },
      assetsInlineLimit: 10240,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1500,
      brotliSize: true,
      emptyOutDir: true,
    },
  };
});
