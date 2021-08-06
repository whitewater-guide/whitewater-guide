import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {
  MapSelectionProvider,
  useRegionQuery,
  useSectionsList,
} from '@whitewater-guide/clients';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Icon from '~/components/Icon';
import { SelectedPOIView, SelectedSectionView } from '~/components/map';
import WithNetworkError from '~/components/WithNetworkError';
import { Screens } from '~/core/navigation';
import {
  RegionTabsNavProps,
  RegionTabsParamsList,
} from '~/screens/region/types';
import theme from '~/theme';

import { LazyRegionInfoScreen } from './info';
import { LazyRegionMapScreen } from './map';
import RegionFAB from './RegionFAB';
import { LazyRegionSectionsListScreen } from './sections-list';
import SectionsProgress from './SectionsProgress';

const Tab = createMaterialBottomTabNavigator<RegionTabsParamsList>();

const RegionTabs: React.FC<RegionTabsNavProps> = () => {
  const { t } = useTranslation();
  const sectionsList = useSectionsList();
  const { error, loading, data, refetch } = useRegionQuery();
  const region = data?.region;
  return (
    <MapSelectionProvider>
      <WithNetworkError
        hasData={!!region}
        hasError={!!error}
        loading={loading}
        refetch={refetch}
      >
        <Tab.Navigator
          shifting
          backBehavior="none"
          activeColor={theme.colors.textLight}
          barStyle={{
            backgroundColor: theme.colors.primary,
          }}
          sceneAnimationEnabled={false}
          keyboardHidesNavigationBar={false}
        >
          <Tab.Screen
            name={Screens.REGION_MAP}
            component={LazyRegionMapScreen}
            options={{
              tabBarLabel: t('region:map.title'),
              // eslint-disable-next-line react/display-name
              tabBarIcon: ({ color }) => <Icon icon="map" color={color} />,
              tabBarTestID: 'region-tab-map',
            }}
          />

          <Tab.Screen
            name={Screens.REGION_SECTIONS_LIST}
            component={LazyRegionSectionsListScreen}
            options={{
              tabBarLabel: t('region:sections.title'),
              // eslint-disable-next-line react/display-name
              tabBarIcon: ({ color }) => (
                <Icon icon="view-list" color={color} />
              ),
              tabBarTestID: 'region-tab-list',
            }}
          />

          <Tab.Screen
            name={Screens.REGION_INFO}
            component={LazyRegionInfoScreen}
            options={{
              tabBarLabel: t('region:info.title'),
              // eslint-disable-next-line react/display-name
              tabBarIcon: ({ color }) => (
                <Icon icon="information" color={color} />
              ),
              tabBarTestID: 'region-tab-info',
            }}
          />
        </Tab.Navigator>
        <RegionFAB region={region} />
        <SelectedPOIView />
        <SelectedSectionView />
        <SectionsProgress
          status={sectionsList.status}
          loaded={sectionsList.sections.length}
          count={sectionsList.count}
        />
      </WithNetworkError>
    </MapSelectionProvider>
  );
};

export default RegionTabs;
