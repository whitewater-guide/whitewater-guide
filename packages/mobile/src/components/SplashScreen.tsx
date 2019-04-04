import React from 'react';
import { Platform } from 'react-native';
import { useScreens } from 'react-native-screens';
import NativeSplashScreen from 'react-native-splash-screen';
import { enablePushNotifications } from '../core/pushNotifications';

interface Props {
  onHide?: () => void;
}

export class SplashScreen extends React.PureComponent<Props> {
  componentWillUnmount() {
    NativeSplashScreen.hide();
    // TODO: possible react-native-screens and react-native-splash-screen conflict causing crashes
    // https://github.com/kmagiera/react-native-screens/issues/54
    if (Platform.OS === 'ios') {
      useScreens();
    }
    if (this.props.onHide) {
      this.props.onHide();
    }
    enablePushNotifications();
  }

  render() {
    return null;
  }
}
