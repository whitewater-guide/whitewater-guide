import React from 'react';
import { getStorybookUI, configure } from '@kadira/react-native-storybook';
import { NativeModules } from 'react-native';
import url from 'url';
import { loadStories } from './storyLoader';
import './addons';

// import your stories
configure(loadStories, module);

const { hostname } = url.parse(NativeModules.SourceCode.scriptURL);

const StorybookUI = getStorybookUI({ port: 7007, host: hostname });

class StorybookUIWrapper extends React.Component {
  render() {
    return StorybookUI();
  }
}

export default StorybookUIWrapper;
