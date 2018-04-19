import React from 'react';
import { translate } from 'react-i18next';
import { NavigationScreenComponent } from 'react-navigation';
import { I18nText } from '../../i18n';
import MyProfileView from './MyProfileView';

const View = translate()(MyProfileView);

export const MyProfileScreen: NavigationScreenComponent = () => (
  <View />
);

MyProfileScreen.navigationOptions = {
  title: (<I18nText>{'myProfile:title'}</I18nText>)
};
