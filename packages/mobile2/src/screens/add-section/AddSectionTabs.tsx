import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTranslation } from 'react-i18next';

import type { AddSectionTabsParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import theme from '../../theme';
import { MockAddSectionTabScreen } from '../mock';

const Tab = createMaterialTopTabNavigator<AddSectionTabsParamsList>();

function AddSectionTabs() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
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
      }}
    >
      <Tab.Screen
        name={Screens.ADD_SECTION_MAIN}
        component={MockAddSectionTabScreen}
        options={{
          tabBarLabel: t('screens:addSection.tabs.main'),
          tabBarButtonTestID: `tab:${Screens.ADD_SECTION_MAIN}`,
        }}
      />
      <Tab.Screen
        name={Screens.ADD_SECTION_ATTRIBUTES}
        component={MockAddSectionTabScreen}
        options={{
          tabBarLabel: t('screens:addSection.tabs.attributes'),
          tabBarButtonTestID: `tab:${Screens.ADD_SECTION_ATTRIBUTES}`,
        }}
      />
      <Tab.Screen
        name={Screens.ADD_SECTION_DESCRIPTION}
        component={MockAddSectionTabScreen}
        options={{
          tabBarLabel: t('screens:addSection.tabs.description'),
          tabBarButtonTestID: `tab:${Screens.ADD_SECTION_DESCRIPTION}`,
        }}
      />
      <Tab.Screen
        name={Screens.ADD_SECTION_FLOWS}
        component={MockAddSectionTabScreen}
        options={{
          tabBarLabel: t('screens:addSection.tabs.flows'),
          tabBarButtonTestID: `tab:${Screens.ADD_SECTION_FLOWS}`,
        }}
      />
      <Tab.Screen
        name={Screens.ADD_SECTION_PHOTOS}
        component={MockAddSectionTabScreen}
        options={{
          tabBarLabel: t('screens:addSection.tabs.photos'),
          tabBarButtonTestID: `tab:${Screens.ADD_SECTION_PHOTOS}`,
        }}
      />
    </Tab.Navigator>
  );
}

export default AddSectionTabs;
