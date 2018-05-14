import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import container from './container';
import MyProfileView from './MyProfileView';

const MyProfileWithData: React.ComponentClass = container(MyProfileView);

export const MyProfileScreen: NavigationScreenComponent = () => (
  <MyProfileWithData />
);

MyProfileScreen.navigationOptions = {
  headerTitle: 'myProfile:title',
};
