import { useRegion, useSectionsList } from '@whitewater-guide/clients';
import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import SectionsList from './SectionsList';

export const RegionSectionsListScreen: NavigationScreenComponent = ({
  navigation,
}) => {
  const { sections, status, refresh } = useSectionsList();
  const { node } = useRegion();
  return (
    <Screen>
      <SectionsList
        status={status}
        sections={sections}
        region={node}
        refresh={refresh}
        navigate={navigation.navigate}
      />
    </Screen>
  );
};

RegionSectionsListScreen.navigationOptions = {
  tabBarLabel: <I18nText>{'region:sections.title'}</I18nText>,
  tabBarIcon: () => <Icon icon="view-list" color={theme.colors.textLight} />,
};
