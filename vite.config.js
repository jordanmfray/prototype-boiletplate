import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173
    }
  },
  build: {
    // Ensure proper token replacement
    minify: true,
    sourcemap: true
  },
  // Use custom template
  template: {
    transformIndexHtml: (html) => {
      return html.replace(
        /__WS_TOKEN__/g,
        'development'
      );
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    },
    extensions: ['.js', '.jsx', '.json']
  }
}); 