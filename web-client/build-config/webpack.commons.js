import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

export const PATHS = {
  root: path.resolve(__dirname, '../'),
  app: path.resolve(__dirname, '../src'),
  build: path.resolve(__dirname, '../build'),
  public: path.resolve(__dirname, '../public'),
};

export const commons = function(env) {
  const isDev = env === 'development';
  const environment = require(`./env.${env}.json`);
  return {
    bail: true,
    entry: {
      app: PATHS.app,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "babel-loader",
          include: PATHS.app,
          query: {
            cacheDirectory: isDev,
            plugins: ['lodash'],
          },
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
        // "file" loader for svg
        {
          test: /\.svg$/,
          loader: 'file-loader',
          query: {
            name: 'static/media/[name].[md5:hash:8].[ext]',
          },
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: require('html-webpack-template'),
        appMountId: 'render-target',
        links: [
          'https://fonts.googleapis.com/css?family=Roboto:400,300,700',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css',
        ],
        inlineManifestWebpackName: 'webpackManifest',
        title: 'Whitewater guide',
      }),
      new webpack.EnvironmentPlugin(environment),
    ],
  };
};
