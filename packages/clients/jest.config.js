module.exports = {
  globals: {
    'ts-jest': {
      // isolatedModules: true
      tsConfig: 'tsconfig.test.json',
    },
  },
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
