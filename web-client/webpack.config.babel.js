import webpackMerge from 'webpack-merge';
import {commons} from './build-config/webpack.commons';

export default function(env) {
  const {config} = require(`./build-config/webpack.${env}`);
  const merge = webpackMerge.smart([config, commons(env)]);
  console.log(merge.module.rules);
  return merge;
}
