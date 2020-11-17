module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'jest',
    'import',
    'react-hooks',
    'simple-import-sort',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    // TODO: clean up
    '@typescript-eslint/no-explicit-any': 'off',
    // TDOO: clean up
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    // TODO: this rule will complain on things like React.memo and React.PureComponent
    'import/no-named-as-default-member': 'off',
    // TODO: fix
    'import/no-named-as-default': 'off',
    'import/order': 'off',
    'jest/no-test-callback': 'off',
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    'no-empty': ['error', { allowEmptyCatch: true }],
    'prefer-const': ['error', { destructuring: 'all' }],
    'react/prop-types': 'off',
    'simple-import-sort/sort': 'error',
    'sort-imports': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project: ['packages/*/tsconfig.json', 'mobile/tsconfig.json'],
      },
    },
  },
  overrides: [
    {
      files: ['**/*.test.{ts,tsx}', '**/__mocks__/**/*.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
  ],
};
