import React from 'react';
import { useScreens } from 'react-native-screens';
import NativeSplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import { splashRemoved } from '../core/actions';

interface OuterProps {
  onHide?: () => void;
}

interface InnerProps {
  splashRemoved: () => void;
}

class SplashScreenInner extends React.PureComponent<InnerProps & OuterProps> {
  componentWillUnmount() {
    // TODO: possible react-native-screens and react-native-splash-screen conflict causing crashes
    // https://github.com/kmagiera/react-native-screens/issues/54
    NativeSplashScreen.hide();
    useScreens();
    if (this.props.onHide) {
      this.props.onHide();
    }
    this.props.splashRemoved();
  }

  render() {
    return null;
  }
}

export const SplashScreen: React.ComponentType<OuterProps> = connect<
  {},
  InnerProps,
  OuterProps
>(
  undefined,
  { splashRemoved },
)(SplashScreenInner);
