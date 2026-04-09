import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  MapSelectionProvider,
  useRegionQuery,
} from '@whitewater-guide/clients';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Icon from '../../components/Icon';
import PaperTabBar from '../../components/PaperTabBar';
import { SwipeableListProvider } from '../../components/SwipeableListProvider';
import type { RegionTabsParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import { MockRegionInfoScreen, MockRegionMapScreen } from '../mock';
import RegionFAB from './RegionFAB';
import RegionSectionsListScreen from './sections-list/RegionSectionsListScreen';
import SectionsProgress from './SectionsProgress';

const screenOptions: BottomTabNavigationOptions = { headerShown: false };

const Tab = createBottomTabNavigator<RegionTabsParamsList>();

function RegionTabs() {
  const { t } = useTranslation();
  const regionQuery = useRegionQuery();
  const hasData = !!regionQuery.data?.region;

  return (
    <MapSelectionProvider>
      <SwipeableListProvider>
        <View style={{ flex: 1 }}>
          <Tab.Navigator
            screenOptions={screenOptions}
            backBehavior="none"
            tabBar={(props) => <PaperTabBar {...props} />}
          >
            <Tab.Screen
              name={Screens.REGION_MAP}
              component={MockRegionMapScreen}
              options={{
                tabBarLabel: t('region:map.title'),
                tabBarIcon: ({ color }) => (
                  <Icon icon="map" color={color} narrow />
                ),
                tabBarButtonTestID: `tab:${Screens.REGION_MAP}`,
              }}
            />
            <Tab.Screen
              name={Screens.REGION_SECTIONS_LIST}
              component={RegionSectionsListScreen}
              options={{
                tabBarLabel: t('region:sections.title'),
                tabBarIcon: ({ color }) => (
                  <Icon icon="view-list" color={color} narrow />
                ),
                tabBarButtonTestID: `tab:${Screens.REGION_SECTIONS_LIST}`,
              }}
            />
            <Tab.Screen
              name={Screens.REGION_INFO}
              component={MockRegionInfoScreen}
              options={{
                tabBarLabel: t('region:info.title'),
                tabBarIcon: ({ color }) => (
                  <Icon icon="information" color={color} narrow />
                ),
                tabBarButtonTestID: `tab:${Screens.REGION_INFO}`,
              }}
            />
          </Tab.Navigator>
        </View>
      </SwipeableListProvider>
      {hasData && <RegionFAB />}
      <SectionsProgress />
    </MapSelectionProvider>
  );
}

export default RegionTabs;
