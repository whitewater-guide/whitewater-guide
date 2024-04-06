import path from 'node:path';

import { esbuildFlowPlugin } from '@bunchtogether/vite-plugin-flow';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const extensions = [
  '.web.tsx',
  '.tsx',
  '.web.ts',
  '.ts',
  '.web.jsx',
  '.jsx',
  '.web.js',
  '.js',
  '.css',
  '.json',
  '.mjs',
];

const development = process.env.NODE_ENV === 'development';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          '@babel/plugin-proposal-export-namespace-from',
          'react-native-reanimated/plugin',
        ],
      },
    }),
  ],
  define: {
    global: 'globalThis',
    __DEV__: JSON.stringify(development),
    DEV: JSON.stringify(development),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  resolve: {
    extensions,
    alias: [
      {
        find: 'react-native',
        replacement: 'react-native-web',
      },
      {
        find: 'react-native/Libraries/Image/AssetRegistry',
        replacement: path.resolve(
          __dirname,
          '../../node_modules/react-native-web/dist/modules/AssetRegistry/index.js',
        ),
      },
    ],
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: extensions,
      // https://github.com/vitejs/vite-plugin-react/issues/192#issuecomment-1627384670
      jsx: 'automatic',
      // need either this or the plugin below
      // loader: { '.js': 'jsx' },
      plugins: [
        esbuildFlowPlugin(/\.(flow|jsx?)$/, (path) =>
          /\.jsx$/.test(path) ? 'jsx' : 'jsx',
        ),
      ],
    },
  },
  server: {
    port: 3000,
  },
});
