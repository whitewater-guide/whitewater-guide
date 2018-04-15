import React from 'react';
import NativeSplashScreen from 'react-native-splash-screen';

export class SplashScreen extends React.PureComponent {
  componentWillUnmount() {
    NativeSplashScreen.hide();
  }

  render() {
    return null;
  }
}
