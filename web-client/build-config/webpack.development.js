import webpack from 'webpack';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import {PATHS} from './webpack.commons';

const PORT = 4000;

export const config = {
  entry: {
    rhl: 'react-hot-loader/patch',
    // activate HMR for React

    wds: `webpack-dev-server/client?http://localhost:${PORT}`,
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    hhds: 'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
  },
  devServer: {
    compress: true,
    contentBase: PATHS.public,
    historyApiFallback: true,
    hot: true,
    port: PORT,
    proxy: {
      "/graphql": "http://localhost:3333",
    },
    quiet: true,
  },
  devtool: 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
};

