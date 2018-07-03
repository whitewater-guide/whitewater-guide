module.exports = (baseConfig, env, config) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve("awesome-typescript-loader")
  });
  config.resolve.extensions = ['.mjs', '.ts', '.tsx', ...config.resolve.extensions];
  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    },
  ];
  return config;
};
