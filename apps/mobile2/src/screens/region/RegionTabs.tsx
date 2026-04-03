import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MapSelectionProvider, SectionsFilterProvider } from '@whitewater-guide/clients';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Icon from '../../components/Icon';
import PaperTabBar from '../../components/PaperTabBar';
import type { RegionTabsParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import {
  MockRegionInfoScreen,
  MockRegionMapScreen,
  MockRegionSectionsListScreen,
} from '../mock';
import RegionFAB from './RegionFAB';
import SectionsProgress from './SectionsProgress';
import { SwipeableListProvider } from './SwipeableListProvider';

const screenOptions: BottomTabNavigationOptions = { headerShown: false };

const Tab = createBottomTabNavigator<RegionTabsParamsList>();

function RegionTabs() {
  const { t } = useTranslation();
  // hasData will be set to true in step 7.4 once region + sections data loads
  const hasData = false;

  return (
    <BottomSheetModalProvider>
      <MapSelectionProvider>
        <SectionsFilterProvider>
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
                  component={MockRegionSectionsListScreen}
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
        </SectionsFilterProvider>
        {hasData && <RegionFAB />}
        <SectionsProgress />
      </MapSelectionProvider>
    </BottomSheetModalProvider>
  );
}

export default RegionTabs;
