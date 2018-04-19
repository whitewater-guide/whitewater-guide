import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { BurgerButton, Screen } from '../../components';
import { I18nText } from '../../i18n';
import container from './container';
import RegionsListView from './RegionsListView';

const RegionsListWithData = container(RegionsListView);

export const RegionsListScreen: NavigationScreenComponent = () =>  (
  <Screen noScroll>
    <RegionsListWithData />
  </Screen>
);

RegionsListScreen.navigationOptions = {
  headerLeft: (<BurgerButton />),
  headerTitle: (<I18nText>{'regionsList:title'}</I18nText>),
};
