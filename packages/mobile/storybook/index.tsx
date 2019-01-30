import {
  addDecorator,
  configure,
  getStorybookUI,
} from '@storybook/react-native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import { I18nProvider } from '../src/i18n';
// @ts-ignore
import { loadStories } from './storyLoader';

addDecorator((story: any) => (
  <I18nProvider>
    <PaperProvider>{story()}</PaperProvider>
  </I18nProvider>
));

// import stories
configure(() => loadStories(), module);
const StorybookUIRoot = getStorybookUI({});

// react-native hot module loader must take in a Class
// https://github.com/facebook/react-native/issues/10991
// https://github.com/storybooks/storybook/issues/2081
// eslint-disable-next-line react/prefer-stateless-function
class StorybookUIHMRRoot extends React.Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return <StorybookUIRoot />;
  }
}

export default StorybookUIHMRRoot;
