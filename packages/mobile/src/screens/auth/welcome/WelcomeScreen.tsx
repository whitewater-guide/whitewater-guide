import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { WelcomeParams } from './types';
import { WelcomeView } from './WelcomeView';

export const WelcomeScreen: NavigationScreenComponent<WelcomeParams> = ({
  navigation,
}) => <WelcomeView verified={navigation.getParam('verified', false)} />;

WelcomeScreen.displayName = 'WelcomeScreen';
