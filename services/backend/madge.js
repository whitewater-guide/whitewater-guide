const path = require('path');

// This is webpack config user by madge to resolve aliases
module.exports = {
  resolve: {
    root: path.resolve(__dirname, './dist'),
    alias: {
      '@apollo': path.resolve(__dirname, './dist/apollo'),
      '@auth': path.resolve(__dirname, './dist/auth'),
      '@db': path.resolve(__dirname, './dist/db'),
      '@features': path.resolve(__dirname, './dist/features'),
      '@log': path.resolve(__dirname, './dist/log'),
      '@minio': path.resolve(__dirname, './dist/minio'),
      '@redis': path.resolve(__dirname, './dist/redis'),
      '@seeds': path.resolve(__dirname, './dist/seeds/test'),
      '@test': path.resolve(__dirname, './dist/test'),
      '@utils': path.resolve(__dirname, './dist/utils'),
      '@ww-commons': path.resolve(__dirname, './dist/ww-commons'),
    },
  },
};
