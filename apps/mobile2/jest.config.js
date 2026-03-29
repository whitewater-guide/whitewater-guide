module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/', '/android/', '/ios/'],
  moduleNameMapper: {
    'react-native-config': '<rootDir>/src/test/react-native-config.ts',
    'react-native-device-info':
      '<rootDir>/src/test/react-native-device-info.ts',
    'react-native-localize': '<rootDir>/src/test/react-native-localize.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-paper|react-native-vector-icons|react-native-safe-area-context|react-native-screens|react-native-gesture-handler|react-native-reanimated|react-native-keyboard-controller|@react-native-async-storage|react-native-sensitive-info|react-native-config|react-native-device-info|react-native-localize|react-native-mmkv|@apollo|@whitewater-guide|apollo3-cache-persist|apollo-link-token-refresh|zen-observable|@zxcvbn-ts)/)',
  ],
};
