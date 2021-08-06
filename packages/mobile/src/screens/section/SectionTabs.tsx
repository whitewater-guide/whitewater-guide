import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useSection } from '@whitewater-guide/clients';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useEffectOnce from 'react-use/lib/useEffectOnce';

import Icon from '~/components/Icon';
import { Screens } from '~/core/navigation';
import {
  SectionScreenNavProps,
  SectionTabsParamsList,
} from '~/screens/section/types';

import theme from '../../theme';
import { LazySectionChartScreen } from './chart';
import { LazySectionGuideScreen } from './guide';
import { LazySectionInfoScreen } from './info';
import { LazySectionMapScreen } from './map';
import { LazySectionMediaScreen } from './media';
import SectionTitle from './SectionTitle';

const Tab = createMaterialBottomTabNavigator<SectionTabsParamsList>();

const SectionTabs: React.FC<SectionScreenNavProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const section = useSection();

  useEffectOnce(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerTitle: () => <SectionTitle section={section} />,
    });
  });

  return (
    <Tab.Navigator
      shifting
      backBehavior="none"
      activeColor={theme.colors.textLight}
      barStyle={{
        backgroundColor: theme.colors.primary,
      }}
      initialRouteName={Screens.SECTION_INFO}
      keyboardHidesNavigationBar={false}
    >
      <Tab.Screen
        name={Screens.SECTION_MAP}
        component={LazySectionMapScreen}
        options={{
          tabBarLabel: t('section:map.title'),
          // eslint-disable-next-line react/display-name
          tabBarIcon: () => <Icon icon="map" color={theme.colors.textLight} />,
          tabBarTestID: 'section-tab-map',
        }}
      />
      <Tab.Screen
        name={Screens.SECTION_CHART}
        component={LazySectionChartScreen}
        options={{
          tabBarLabel: t('section:chart.title'),
          tabBarIcon: () => (
            <Icon icon="chart-line" color={theme.colors.textLight} />
          ),
          tabBarTestID: 'section-tab-chart',
        }}
      />
      <Tab.Screen
        name={Screens.SECTION_INFO}
        component={LazySectionInfoScreen}
        options={{
          tabBarLabel: t('section:info.title'),
          // eslint-disable-next-line react/display-name
          tabBarIcon: () => (
            <Icon icon="information" color={theme.colors.textLight} />
          ),
          tabBarTestID: 'section-tab-info',
        }}
      />
      <Tab.Screen
        name={Screens.SECTION_GUIDE}
        component={LazySectionGuideScreen}
        options={{
          tabBarLabel: t('section:guide.title'),
          // eslint-disable-next-line react/display-name
          tabBarIcon: () => (
            <Icon icon="book-open-variant" color={theme.colors.textLight} />
          ),
          tabBarTestID: 'section-tab-guide',
        }}
      />
      <Tab.Screen
        name={Screens.SECTION_MEDIA}
        component={LazySectionMediaScreen}
        options={{
          tabBarLabel: t('section:media.title'),
          // eslint-disable-next-line react/display-name
          tabBarIcon: () => (
            <Icon icon="image-multiple" color={theme.colors.textLight} />
          ),
          tabBarTestID: 'section-tab-media',
        }}
      />
    </Tab.Navigator>
  );
};

export default SectionTabs;
