import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Screen } from '../../../components';
import { I18nText } from '../../../i18n';
import SectionsList from './SectionsList';

export const RegionSectionsListScreen: NavigationScreenComponent = (props) =>  (
  <Screen noScroll noPadding>
    <SectionsList sections={props.screenProps.sections.nodes} />
  </Screen>
);

RegionSectionsListScreen.navigationOptions = {
  tabBarLabel: <I18nText>{'region:sections.title'}</I18nText>,
};
