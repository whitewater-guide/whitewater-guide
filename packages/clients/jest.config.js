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
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  setupTestFrameworkScriptFile: '<rootDir>/jest.setup.ts',
};
