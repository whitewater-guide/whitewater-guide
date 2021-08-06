module.exports = {
  displayName: require('./package.json').name,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '<rootDir>/cjs/',
    '<rootDir>/esm/',
    '<rootDir>/node_modules/',
  ],
};
