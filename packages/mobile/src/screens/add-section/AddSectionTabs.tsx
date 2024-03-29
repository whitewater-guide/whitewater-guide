import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Screens } from '~/core/navigation';
import type {
  AddSectionTabsNavProps,
  AddSectionTabsParamsList,
} from '~/screens/add-section/types';
import theme from '~/theme';

import { LazyAttributesScreen } from './attributes';
import { LazyDescriptionScreen } from './description';
import { LazyFlowsScreen } from './flows';
import { LazyMainScreen } from './main';
import { LazyPhotosScreen } from './photos';

const Tab = createMaterialTopTabNavigator<AddSectionTabsParamsList>();

const AddSectionTabs: React.FC<AddSectionTabsNavProps> = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      backBehavior="none"
      tabBarPosition="bottom"
      initialLayout={{
        height: theme.stackScreenHeight,
        width: theme.screenWidth,
      }}
      screenOptions={{
        swipeEnabled: false,
        lazy: true,
        tabBarShowIcon: false,
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: {
          bottom: undefined,
          top: 0,
          backgroundColor: theme.colors.accent,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.primary,
        },
        tabBarAllowFontScaling: true,
      }}
    >
      <Tab.Screen
        name={Screens.ADD_SECTION_MAIN}
        component={LazyMainScreen}
        options={{
          tabBarLabel: t('screens:addSection.tabs.main'),
          tabBarTestID: 'add-section-tab-main',
        }}
      />
      <Tab.Screen
        name={Screens.ADD_SECTION_ATTRIBUTES}
        component={LazyAttributesScreen}
        options={{
          tabBarLabel: t('screens:addSection.tabs.attributes'),
          tabBarTestID: 'add-section-tab-attributes',
        }}
      />
      <Tab.Screen
        name={Screens.ADD_SECTION_DESCRIPTION}
        component={LazyDescriptionScreen}
        options={{
          tabBarLabel: t('screens:addSection.tabs.description'),
          tabBarTestID: 'add-section-tab-description',
        }}
      />
      <Tab.Screen
        name={Screens.ADD_SECTION_FLOWS}
        component={LazyFlowsScreen}
        options={{
          tabBarLabel: t('screens:addSection.tabs.flows'),
          tabBarTestID: 'add-section-tab-flows',
        }}
      />
      <Tab.Screen
        name={Screens.ADD_SECTION_PHOTOS}
        component={LazyPhotosScreen}
        options={{
          tabBarLabel: t('screens:addSection.tabs.photos'),
          tabBarTestID: 'add-section-tab-photos',
        }}
      />
    </Tab.Navigator>
  );
};

export default AddSectionTabs;
