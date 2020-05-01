module.exports = {
  dependencies: {
    'react-native-fs': {
      platforms: {
        android: null, // linked manually
      },
    },
    'react-native-code-push': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-code-push/android/app',
        },
      },
    },
  },
};
