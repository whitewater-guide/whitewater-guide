import {
  addDecorator,
  configure,
  getStorybookUI,
} from '@storybook/react-native';
import React from 'react';
import SplashScreen from 'react-native-bootsplash';
import { Provider as PaperProvider } from 'react-native-paper';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { I18nProvider } from '../src/i18n';
import { PaperTheme } from '../src/theme';
// @ts-ignore
import { loadStories } from './storyLoader';

console.disableYellowBox = true;

addDecorator((story: any) => {
  const Screen = () => story();
  const Navigator = createAppContainer(createSwitchNavigator({ Screen }));

  return (
    <I18nProvider>
      <PaperProvider theme={PaperTheme}>
        <Navigator />
      </PaperProvider>
    </I18nProvider>
  );
});

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
