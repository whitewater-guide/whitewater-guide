import React from 'react';
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
    NativeSplashScreen.hide();
    if (this.props.onHide) {
      this.props.onHide();
    }
    this.props.splashRemoved();
  }

  render() {
    return null;
  }
}

export const SplashScreen: React.ComponentType<OuterProps> = connect<{}, InnerProps, OuterProps>(
  undefined,
  { splashRemoved },
)(SplashScreenInner);
