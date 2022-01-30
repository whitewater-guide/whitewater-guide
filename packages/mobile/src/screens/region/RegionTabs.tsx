import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {
  MapSelectionProvider,
  useRegionQuery,
  useSectionsList,
} from '@whitewater-guide/clients';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Icon from '~/components/Icon';
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
import useFakeChatTab from './useFakeChatTab';

const Tab = createMaterialBottomTabNavigator<RegionTabsParamsList>();

const RegionTabs: React.FC<RegionTabsNavProps> = () => {
  const { t } = useTranslation();
  const sectionsList = useSectionsList();
  const regionQuery = useRegionQuery();
  const hasData = !!sectionsList.sections && !!regionQuery.data?.region;
  // regionId is not necessary for the app to work
  // it's here because passing it via [initialParams](https://reactnavigation.org/docs/screen#initialparams)
  // seems to be simplest way to track screen params in sentry
  const regionId = regionQuery.data?.region?.id;
  const roomId = regionQuery.data?.region?.roomId;
  const chatListeners = useFakeChatTab();

  return (
    <MapSelectionProvider>
      <Tab.Navigator
        shifting
        backBehavior="none"
        activeColor={theme.colors.textLight}
        barStyle={{
          backgroundColor: theme.colors.primary,
          // height: hasData ? undefined : 0,
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
          initialParams={{ regionId }}
        />

        <Tab.Screen
          name={Screens.REGION_SECTIONS_LIST}
          component={LazyRegionSectionsListScreen}
          options={{
            tabBarLabel: t('region:sections.title'),
            tabBarIcon: ({ color }) => <Icon icon="view-list" color={color} />,
            tabBarTestID: 'region-tab-list',
          }}
          initialParams={{ regionId }}
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
          initialParams={{ regionId }}
        />

        <Tab.Screen
          name={Screens.REGION_FAKE_CHAT}
          component={View}
          options={{
            tabBarLabel: t('region:info.chat'),
            tabBarIcon: ({ color }) => (
              <Icon icon="message-text" color={color} />
            ),
            tabBarTestID: 'region-tab-chat',
          }}
          listeners={chatListeners}
          initialParams={{ roomId }}
        />
      </Tab.Navigator>

      {hasData && <RegionFAB region={regionQuery.data?.region} />}

      <SectionsProgress
        status={sectionsList.status}
        loaded={sectionsList.sections?.length ?? 0}
        count={sectionsList.count}
      />
    </MapSelectionProvider>
  );
};

export default RegionTabs;
