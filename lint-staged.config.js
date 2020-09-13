module.exports = {
  '**/*.{js,jsx,ts,tsx}': ['eslint --fix', 'git add'],
  '**/*.{json,md,yaml,yml}': ['prettier --write', 'git add'],
};
