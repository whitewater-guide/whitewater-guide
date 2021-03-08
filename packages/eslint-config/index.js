module.exports = {
  plugins: ['simple-import-sort'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'react-app',
    'react-app/jest',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'import/no-anonymous-default-export': 'off',
    'import/no-unresolved': 'error',
    'import/order': 'off',
    'jest/no-test-callback': 'off',
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    'no-empty': ['error', { allowEmptyCatch: true }],
    'prefer-const': ['error', { destructuring: 'all' }],
    'react/prop-types': 'off',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-imports': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['packages/*/tsconfig.json'],
      },
    },
  },
  overrides: [
    // Tests and mocks
    {
      files: ['**/__tests__/**/*', '**/*.{spec,test}.*', '**/__mocks__/**/*'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
  ],
};
