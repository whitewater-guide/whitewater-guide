import React from 'react';
import NativeSplashScreen from 'react-native-splash-screen';

interface Props {
  onHide?: () => void;
}

export class SplashScreen extends React.PureComponent<Props> {
  componentWillUnmount() {
    NativeSplashScreen.hide();
    if (this.props.onHide) {
      this.props.onHide();
    }
  }

  render() {
    return null;
  }
}
