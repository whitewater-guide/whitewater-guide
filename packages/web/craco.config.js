module.exports = {
  eslint: {
    enable: false,
  },
  jest: {
    configure: {
      reporters: ['default', 'jest-summary-reporter'],
    },
  },
};
