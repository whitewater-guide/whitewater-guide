import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useSection } from '@whitewater-guide/clients';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Icon from '../../components/Icon';
import PaperTabBar from '../../components/PaperTabBar';
import { Screens } from '../../core/navigation';
import SectionChartScreen from './chart/SectionChartScreen';
import SectionInfoScreen from './info/SectionInfoScreen';
import SectionMapScreen from './map/SectionMapScreen';
import SectionMediaScreen from './media/SectionMediaScreen';
import type {
  SectionScreenProps,
  SectionTabsParamsList,
} from './navigation-types';
import SectionTitle from './SectionTitle';

const screenOptions: BottomTabNavigationOptions = { headerShown: false };

const Tab = createBottomTabNavigator<SectionTabsParamsList>();

function SectionTabs() {
  const { t } = useTranslation();
  const section = useSection();
  const navigation = useNavigation<SectionScreenProps['navigation']>();

  useEffect(() => {
    if (section) {
      navigation.setOptions({
        headerTitle: () => <SectionTitle section={section} />,
      });
    }
  }, [navigation, section]);

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
          component={SectionMapScreen}
          options={{
            tabBarLabel: t('screens:section.map.title'),
            tabBarIcon: ({ color }) => <Icon icon="map" color={color} narrow />,
            tabBarButtonTestID: `tab:${Screens.SECTION_MAP}`,
          }}
        />
        {!!section?.gauge && (
          <Tab.Screen
            name={Screens.SECTION_CHART}
            component={SectionChartScreen}
            options={{
              tabBarLabel: t('screens:section.chart.title'),
              tabBarIcon: ({ color }) => (
                <Icon icon="chart-line" color={color} narrow />
              ),
              tabBarButtonTestID: `tab:${Screens.SECTION_CHART}`,
            }}
          />
        )}
        <Tab.Screen
          name={Screens.SECTION_INFO}
          component={SectionInfoScreen}
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
          component={SectionMediaScreen}
          options={{
            tabBarLabel: t('screens:section.media.title'),
            tabBarIcon: ({ color }) => (
              <Icon icon="image-multiple" color={color} narrow />
            ),
            tabBarButtonTestID: `tab:${Screens.SECTION_MEDIA}`,
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

export default SectionTabs;
