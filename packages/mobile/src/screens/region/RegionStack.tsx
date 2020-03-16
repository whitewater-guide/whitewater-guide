import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import {
  SectionsSearchStringContext,
  SectionsSearchStringSetterContext,
  useRegion,
} from '@whitewater-guide/clients';
import React from 'react';
import Config from 'react-native-config';
import { getHeaderRenderer } from '~/components/header';
import { Screens } from '~/core/navigation';
import { RegionStackParamsList } from '~/screens/region/types';
import { LazyAddSectionScreen } from './add-section';
import { LazyFilterScreen } from './filter';
import RegionTabs from './RegionTabs';
import RegionTitle from './RegionTitle';

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
