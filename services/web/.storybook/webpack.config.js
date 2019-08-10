module.exports = ({ config, mode }) => {
  // TODO: Disable eslint until we switch to it
  config.module.rules = config.module.rules.filter(({ enforce }) => !enforce);
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      presets: [['react-app', { flow: false, typescript: true }]],
    },
  });
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
