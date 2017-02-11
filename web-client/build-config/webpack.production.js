import webpack from 'webpack';
import mergeWebpack from 'webpack-merge';
import packageJSON from '../package.json';
import InlineManifestWebpackPlugin from 'inline-manifest-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import {PATHS} from './webpack.commons';

export const config = mergeWebpack([
  {
    entry: {
      vendor: Object.keys(packageJSON.dependencies),
    },
    output: {
      path: PATHS.build,
      filename: '[name].[chunkhash].js',
    },
    devtool: 'source-map',
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest'], // add manifest chunk
        minChunks: Infinity
      }),
      new InlineManifestWebpackPlugin({ name: 'webpackManifest' }),
      new CleanWebpackPlugin(['build'], {root: PATHS.root}),
    ],
  },
]);
