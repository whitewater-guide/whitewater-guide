import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Screen } from '../../components';
import MyProfileView from './MyProfileView';

export const MyProfileScreen: NavigationScreenComponent = () => (
  <Screen safe={true}>
    <MyProfileView />
  </Screen>
);

MyProfileScreen.navigationOptions = {
  headerTitle: 'myProfile:title',
};
