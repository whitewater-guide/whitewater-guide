import webpack from 'webpack';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import {PATHS} from './webpack.commons';

const PORT = 4000;

export const config = {
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

