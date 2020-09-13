const webpack = require('webpack');

const findBabelLoader = (config) =>
  config.module.rules.findIndex(
    (rule) =>
      rule.use &&
      rule.use[0] &&
      rule.use[0].loader &&
      rule.use[0].loader.includes('babel'),
  );

const addBabelPlugin = (plugin) => (config) => {
  config.module.rules[findBabelLoader(config)].use[0].options.plugins.push(
    plugin,
  );
  return config;
};

module.exports = ({ config }) => {
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
  // https://medium.com/@antonkorzunov/rewrite-a-storybook-ae4682176cc3
  config = addBabelPlugin('rewiremock/babel')(config);
  config.plugins.push(
    ...[
      new webpack.NamedModulesPlugin(),
      new (require('rewiremock/webpack/plugin'))(),
    ],
  );
  return config;
};
