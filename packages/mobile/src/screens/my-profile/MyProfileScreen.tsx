import { Screen } from 'components/Screen';
import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import MyProfileView from './MyProfileView';

const MyProfileScreen: NavigationScreenComponent = () => (
  <Screen safe={true}>
    <MyProfileView />
  </Screen>
);

export default MyProfileScreen;
