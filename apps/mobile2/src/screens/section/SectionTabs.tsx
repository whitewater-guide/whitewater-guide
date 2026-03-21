import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Icon from '../../components/Icon';
import PaperTabBar from '../../components/PaperTabBar';
import PlaceholderScreen from '../../components/PlaceholderScreen';
import type { SectionTabsParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import { MockSectionInfoScreen } from '../mock';
import SectionFAB from './SectionFAB';

const screenOptions: BottomTabNavigationOptions = { headerShown: false };

const Tab = createBottomTabNavigator<SectionTabsParamsList>();

function SectionTabs() {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={screenOptions}
        backBehavior="none"
        initialRouteName={Screens.SECTION_INFO}
        tabBar={(props) => <PaperTabBar {...props} />}
      >
        <Tab.Screen
          name={Screens.SECTION_MAP}
          component={PlaceholderScreen}
          options={{
            tabBarLabel: t('screens:section.map.title'),
            tabBarIcon: ({ color }) => <Icon icon="map" color={color} narrow />,
            tabBarButtonTestID: `tab:${Screens.SECTION_MAP}`,
          }}
        />
        <Tab.Screen
          name={Screens.SECTION_CHART}
          component={PlaceholderScreen}
          options={{
            tabBarLabel: t('screens:section.chart.title'),
            tabBarIcon: ({ color }) => (
              <Icon icon="chart-line" color={color} narrow />
            ),
            tabBarButtonTestID: `tab:${Screens.SECTION_CHART}`,
          }}
        />
        <Tab.Screen
          name={Screens.SECTION_INFO}
          component={MockSectionInfoScreen}
          options={{
            tabBarLabel: t('screens:section.info.title'),
            tabBarIcon: ({ color }) => (
              <Icon icon="information" color={color} narrow />
            ),
            tabBarButtonTestID: `tab:${Screens.SECTION_INFO}`,
          }}
        />
        <Tab.Screen
          name={Screens.SECTION_MEDIA}
          component={PlaceholderScreen}
          options={{
            tabBarLabel: t('screens:section.media.title'),
            tabBarIcon: ({ color }) => (
              <Icon icon="image-multiple" color={color} narrow />
            ),
            tabBarButtonTestID: `tab:${Screens.SECTION_MEDIA}`,
          }}
        />
      </Tab.Navigator>
      <SectionFAB />
    </View>
  );
}

export default SectionTabs;
