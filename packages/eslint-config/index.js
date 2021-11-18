module.exports = {
  plugins: ['simple-import-sort', 'unused-imports', 'testing-library'],
  extends: [
    'alloy',
    'alloy/react',
    'alloy/typescript',
    'plugin:jest/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/member-ordering': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'import/no-unresolved': ['error', { ignore: ['~'] }],
    'import/order': 'off',
    'import/no-cycle': 'off',
    // We often have to deal with external libraries that do not respect this rule
    'max-params': 'off',
    'max-nested-callbacks': ['error', 4],
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    'no-undef': 'off',
    'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-imports': 'off',
  },
  settings: {
    'import/ignore': ['victory.*'],
    'import/resolver': {
      typescript: {
        project: ['packages/*/tsconfig.json'],
      },
    },
  },
  overrides: [
    // set typescript parser
    {
      files: ['**/*.ts?(x)', '**/*.d.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    // Tests and mocks
    {
      files: ['**/__tests__/**/*', '**/*.{spec,test}.*', '**/__mocks__/**/*'],
      extends: ['plugin:testing-library/react'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'max-nested-callbacks': 'off',
      },
    },
  ],
};
