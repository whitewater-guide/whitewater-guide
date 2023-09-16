module.exports = {
  '**/*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
  '**/*.{json,md,yaml,yml}': ['prettier --write'],
};
