import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import MyProfileView from './MyProfileView';

export const MyProfileScreen: NavigationScreenComponent = () => (
  <MyProfileView />
);

MyProfileScreen.navigationOptions = {
  headerTitle: 'myProfile:title',
};
