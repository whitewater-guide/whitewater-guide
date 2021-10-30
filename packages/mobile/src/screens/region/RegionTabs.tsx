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
  const regionQuery = useRegionQuery();
  const hasData = !!sectionsList.sections && !!regionQuery.data?.region;

  return (
    <MapSelectionProvider>
      <Tab.Navigator
        shifting
        backBehavior="none"
        activeColor={theme.colors.textLight}
        barStyle={{
          backgroundColor: theme.colors.primary,
          height: hasData ? undefined : 0,
        }}
        sceneAnimationEnabled={false}
        keyboardHidesNavigationBar={false}
      >
        <Tab.Screen
          name={Screens.REGION_MAP}
          component={LazyRegionMapScreen}
          options={{
            tabBarLabel: t('region:map.title'),
            tabBarIcon: ({ color }) => <Icon icon="map" color={color} />,
            tabBarTestID: 'region-tab-map',
          }}
        />

        <Tab.Screen
          name={Screens.REGION_SECTIONS_LIST}
          component={LazyRegionSectionsListScreen}
          options={{
            tabBarLabel: t('region:sections.title'),
            tabBarIcon: ({ color }) => <Icon icon="view-list" color={color} />,
            tabBarTestID: 'region-tab-list',
          }}
        />

        <Tab.Screen
          name={Screens.REGION_INFO}
          component={LazyRegionInfoScreen}
          options={{
            tabBarLabel: t('region:info.title'),
            tabBarIcon: ({ color }) => (
              <Icon icon="information" color={color} />
            ),
            tabBarTestID: 'region-tab-info',
          }}
        />
      </Tab.Navigator>

      {hasData && <RegionFAB region={regionQuery.data?.region} />}

      <SelectedPOIView />
      <SelectedSectionView />
      <SectionsProgress
        status={sectionsList.status}
        loaded={sectionsList.sections?.length ?? 0}
        count={sectionsList.count}
      />
    </MapSelectionProvider>
  );
};

export default RegionTabs;
