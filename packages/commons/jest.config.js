module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  displayName: require('./package.json').name,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
};
