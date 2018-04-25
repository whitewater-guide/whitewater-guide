import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import HeaderRight from './HeaderRight';
import SectionsList from './SectionsList';

export const RegionSectionsListScreen: NavigationScreenComponent = (props) =>  (
  <Screen noScroll noPadding>
    <SectionsList
      sections={props.screenProps.sections.nodes}
      navigate={props.navigation.navigate}
    />
  </Screen>
);

RegionSectionsListScreen.navigationOptions = {
  tabBarLabel: <I18nText>{'region:sections.title'}</I18nText>,
  tabBarIcon: () => (
    <Icon icon="view-list" color={theme.colors.textLight} />
  ),
  headerRight: <HeaderRight />,
};
