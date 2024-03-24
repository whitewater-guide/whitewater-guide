import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: 'window',
  },
  esbuild: {
    // loader: 'jsx',
    // include: /.*\.jsx?$/,
    loader: 'tsx',
    include: /src\/.*\.[tj]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    include: ['@whitewater-guide/schema'],
    esbuildOptions: {
      loader: {
        '.js': 'tsx',
      },
      mainFields: ['module', 'main'],
      resolveExtensions: ['.tsx', '.ts', '.jsx', '.web.js', '.js'],
    },
  },
  build: {
    commonjsOptions: {
      include: [/@whitewater-guide\/schema/, /node_modules/],
    },
  },
  resolve: {
    extensions: ['.web.tsx', '.web.jsx', '.web.js', '.tsx', '.ts', '.js'],
    alias: {
      'react-native': 'react-native-web',
    },
  },
  plugins: [react()],
});
