import webpack from 'webpack';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import {PATHS} from './webpack.commons';

const PORT = 4000;

export const config = {
  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${PORT}`,
    'webpack/hot/only-dev-server',
    PATHS.app,
  ],
  output: {
    path: PATHS.build,
    filename: '[name].js',
    publicPath: '/',
    devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  devServer: {
    compress: true,
    contentBase: PATHS.public,
    publicPath: '/',
    historyApiFallback: true,
    hot: true,
    host: '0.0.0.0',
    port: PORT,
    proxy: {
      "/graphql": "http://localhost:3333",
      "/thumbs": "http://localhost:3333",
    },
    quiet: true,
  },
  devtool: 'eval',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
};
