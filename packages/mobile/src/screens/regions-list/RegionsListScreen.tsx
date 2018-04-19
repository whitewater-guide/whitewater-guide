import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { BurgerButton, Screen } from '../../components';
import { I18nText } from '../../i18n';
import container from './container';
import RegionsListView from './RegionsListView';
import { OuterProps } from './types';

const RegionsListWithData: React.ComponentType<OuterProps> = container(RegionsListView);

export const RegionsListScreen: NavigationScreenComponent = ({ navigation }) =>  (
  <Screen noScroll>
    <RegionsListWithData navigate={navigation.navigate} />
  </Screen>
);

RegionsListScreen.navigationOptions = {
  headerLeft: (<BurgerButton />),
  headerTitle: (<I18nText>{'regionsList:title'}</I18nText>),
};
