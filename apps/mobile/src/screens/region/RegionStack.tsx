import type { StackNavigationOptions } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';
import {
  SectionsSearchStringContext,
  SectionsSearchStringSetterContext,
  useRegion,
} from '@whitewater-guide/clients';
import React, { useMemo } from 'react';
import Config from 'react-native-ultimate-config';

import { getHeaderRenderer } from '~/components/header';
import { Screens } from '~/core/navigation';
import type { RegionStackParamsList } from '~/screens/region/types';

import { LazyFilterScreen } from './filter';
import RegionTabs from './RegionTabs';
import RegionTitle from './RegionTitle';

const Stack = createStackNavigator<RegionStackParamsList>();

const RegionStack: React.FC = () => {
  const region = useRegion();
  const regionLoaded = !!region;

  const screenOptions = useMemo(
    (): StackNavigationOptions => ({
      headerMode: 'screen',
      header: getHeaderRenderer(
        false,
        regionLoaded
          ? [SectionsSearchStringContext, SectionsSearchStringSetterContext]
          : undefined,
        'region:sectionSearchPlaceholder',
      ),
      gestureEnabled: false,
      animationEnabled: Config.E2E_MODE !== 'true',
    }),
    [regionLoaded],
  );

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name={Screens.REGION_TABS}
        component={RegionTabs}
        options={{
          headerTitle: () => <RegionTitle region={region} />,
        }}
      />
      <Stack.Screen
        name={Screens.FILTER}
        component={LazyFilterScreen}
        options={{
          header: getHeaderRenderer(false),
        }}
      />
    </Stack.Navigator>
  );
};

export default RegionStack;
