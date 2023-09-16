process.env.TZ = 'Etc/UTC';
module.exports = {
  displayName: require('./package.json').name,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  reporters: ['default', 'jest-summary-reporter'],
  setupFilesAfterEnv: ['jest-extended/all'],
};
