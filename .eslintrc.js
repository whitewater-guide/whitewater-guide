module.exports = {
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './packages/*/tsconfig.json'],
  },
  // This config can be found in this very same monorepo
  extends: ['@whitewater-guide/eslint-config'],
};
