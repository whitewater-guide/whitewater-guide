import type { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import type { RegionDetailsFragment } from '@whitewater-guide/clients';
import { useTranslation } from 'react-i18next';

import { Screens } from '../../core/navigation';
import theme from '../../theme';
import AttributesScreen from './attributes';
import DescriptionScreen from './description';
import FlowsScreen from './flows';
import MainScreen from './main';
import type { AddSectionTabsParamsList } from './navigation-types';
import { PhotosScreen } from './photos';

const screenOptions: MaterialTopTabNavigationOptions = {
  swipeEnabled: false,
  lazy: true,
  tabBarScrollEnabled: true,
  tabBarIndicatorStyle: {
    top: 0,
    bottom: undefined,
    backgroundColor: theme.colors.accent,
  },
  tabBarStyle: {
    backgroundColor: theme.colors.primary,
  },
  tabBarAllowFontScaling: true,
};

const Tab = createMaterialTopTabNavigator<AddSectionTabsParamsList>();

interface Props {
  region?: RegionDetailsFragment | null;
}

function AddSectionTabs({ region }: Props) {
  const { t } = useTranslation();

  return (
    <Tab.Navigator tabBarPosition="bottom" screenOptions={screenOptions}>
      <Tab.Screen
        name={Screens.ADD_SECTION_MAIN}
        component={MainScreen}
        options={{
          tabBarLabel: t('screens:addSection.tabs.main'),
          tabBarButtonTestID: `tab:${Screens.ADD_SECTION_MAIN}`,
        }}
        initialParams={{ region }}
      />
      <Tab.Screen
        name={Screens.ADD_SECTION_ATTRIBUTES}
        component={AttributesScreen}
        options={{
          tabBarLabel: t('screens:addSection.tabs.attributes'),
          tabBarButtonTestID: `tab:${Screens.ADD_SECTION_ATTRIBUTES}`,
        }}
        initialParams={{ region }}
      />
      <Tab.Screen
        name={Screens.ADD_SECTION_DESCRIPTION}
        component={DescriptionScreen}
        options={{
          tabBarLabel: t('screens:addSection.tabs.description'),
          tabBarButtonTestID: `tab:${Screens.ADD_SECTION_DESCRIPTION}`,
        }}
        initialParams={{ region }}
      />
      <Tab.Screen
        name={Screens.ADD_SECTION_FLOWS}
        component={FlowsScreen}
        options={{
          tabBarLabel: t('screens:addSection.tabs.flows'),
          tabBarButtonTestID: `tab:${Screens.ADD_SECTION_FLOWS}`,
        }}
        initialParams={{ region }}
      />
      <Tab.Screen
        name={Screens.ADD_SECTION_PHOTOS}
        component={PhotosScreen}
        options={{
          tabBarLabel: t('screens:addSection.tabs.photos'),
          tabBarButtonTestID: `tab:${Screens.ADD_SECTION_PHOTOS}`,
        }}
        initialParams={{ region }}
      />
    </Tab.Navigator>
  );
}

export default AddSectionTabs;
