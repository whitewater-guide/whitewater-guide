import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import { ScreenProps } from '../types';
import SectionsList from './SectionsList';

export const RegionSectionsListScreen: NavigationScreenComponent = ({
  navigation,
  screenProps,
}) => {
  const {
    region,
    sections,
    updateSections,
    sectionsStatus,
  }: ScreenProps = screenProps as any;
  return (
    <Screen>
      <SectionsList
        status={sectionsStatus}
        sections={sections}
        region={region.node}
        refresh={updateSections}
        navigate={navigation.navigate}
      />
    </Screen>
  );
};

RegionSectionsListScreen.navigationOptions = {
  tabBarLabel: <I18nText>{'region:sections.title'}</I18nText>,
  tabBarIcon: () => <Icon icon="view-list" color={theme.colors.textLight} />,
};
