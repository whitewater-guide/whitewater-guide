module.exports = {
  plugins: ['node'],
  rules: {
    'node/no-process-env': 'error',
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/__mocks__/**/*.ts', '**/migrations/**/*.ts'],
      rules: {
        'node/no-process-env': 'off',
      },
    },
  ],
};
