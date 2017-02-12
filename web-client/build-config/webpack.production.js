import webpack from 'webpack';
import mergeWebpack from 'webpack-merge';
import packageJSON from '../package.json';
import InlineManifestWebpackPlugin from 'inline-manifest-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import cssnano from 'cssnano';
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
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            use: 'css-loader',
            fallback: 'style-loader',
          }),
        },
      ],
    },
    devtool: 'source-map',
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        beautify: false, // Don't beautify output (uglier to read)
        comments: false, // Eliminate comments

        // Compression specific options
        compress: {
          warnings: false,
          drop_console: true, // Drop `console` statements
        },

        mangle: {
          except: ['$', '_', 'webpackJsonp'],
          screw_ie8 : true,
        },
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: cssnano,
        cssProcessorOptions: {
          discardComments: {
            removeAll: true,
          },
        },
      }),
      new ExtractTextPlugin('[name].[hash].css'),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest'], // add manifest chunk
        minChunks: Infinity
      }),
      new InlineManifestWebpackPlugin({ name: 'webpackManifest' }),
      new CleanWebpackPlugin(['build'], {root: PATHS.root}),
    ],
  },
]);
