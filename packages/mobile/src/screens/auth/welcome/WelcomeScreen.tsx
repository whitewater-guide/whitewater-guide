import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { WelcomeParams } from './types';
import { WelcomeView } from './WelcomeView';

const WelcomeScreen: NavigationScreenComponent<WelcomeParams> = ({
  navigation,
}) => <WelcomeView verified={navigation.getParam('verified', false)} />;

export default WelcomeScreen;
