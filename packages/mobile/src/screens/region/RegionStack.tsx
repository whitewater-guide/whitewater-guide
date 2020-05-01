import {
  SectionsSearchStringContext,
  SectionsSearchStringSetterContext,
  useRegion,
} from '@whitewater-guide/clients';
import {
  StackNavigationOptions,
  createStackNavigator,
} from '@react-navigation/stack';

import Config from 'react-native-ultimate-config';
import { LazyAddSectionScreen } from './add-section';
import { LazyFilterScreen } from './filter';
import React from 'react';
import { RegionStackParamsList } from '~/screens/region/types';
import RegionTabs from './RegionTabs';
import RegionTitle from './RegionTitle';
import { Screens } from '~/core/navigation';
import { getHeaderRenderer } from '~/components/header';

const Stack = createStackNavigator<RegionStackParamsList>();

const screenOptions: StackNavigationOptions = {
  header: getHeaderRenderer(
    false,
    [SectionsSearchStringContext, SectionsSearchStringSetterContext],
    'region:sectionSearchPlaceholder',
  ),
  gestureEnabled: false,
  animationEnabled: Config.E2E_MODE !== 'true',
};

const RegionStack: React.FC = () => {
  const { node } = useRegion();
  return (
    <Stack.Navigator screenOptions={screenOptions} headerMode="screen">
      <Stack.Screen
        name={Screens.REGION_TABS}
        component={RegionTabs}
        options={{
          headerTitle: () => <RegionTitle region={node} />,
        }}
      />
      <Stack.Screen name={Screens.FILTER} component={LazyFilterScreen} />
      <Stack.Screen
        name={Screens.ADD_SECTION_SCREEN}
        component={LazyAddSectionScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default RegionStack;
