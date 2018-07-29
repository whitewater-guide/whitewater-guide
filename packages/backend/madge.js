const path = require('path');

// This is webpack config user by madge to resolve aliases
module.exports = {
  resolve: {
    root: path.resolve(__dirname, './src'),
    alias: {
      '@apollo': path.resolve(__dirname, './src/apollo'),
      '@auth': path.resolve(__dirname, './src/auth'),
      '@db': path.resolve(__dirname, './src/db'),
      '@features': path.resolve(__dirname, './src/features'),
      '@log': path.resolve(__dirname, './src/log'),
      '@minio': path.resolve(__dirname, './src/minio'),
      '@redis': path.resolve(__dirname, './src/redis'),
      '@seeds': path.resolve(__dirname, './src/seeds/test'),
      '@test': path.resolve(__dirname, './src/test'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@ww-commons': path.resolve(__dirname, './src/ww-commons'),
    }
  }
};
