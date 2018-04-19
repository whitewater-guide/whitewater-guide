import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { I18nText } from '../../i18n';
import container from './container';
import MyProfileView from './MyProfileView';

const MyProfileWithData: React.ComponentClass = container(MyProfileView);

export const MyProfileScreen: NavigationScreenComponent = () => (
  <MyProfileWithData />
);

MyProfileScreen.navigationOptions = {
  title: (<I18nText>{'myProfile:title'}</I18nText>),
};
