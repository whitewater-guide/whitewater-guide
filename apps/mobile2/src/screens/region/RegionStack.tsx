import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  SectionsSearchStringContext,
  SectionsSearchStringSetterContext,
} from '@whitewater-guide/clients';
import { Platform } from 'react-native';

import type { SearchContexts } from '../../components/header';
import { getHeaderRenderer } from '../../components/header';
import type { RegionStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import theme from '../../theme';
import FilterScreen from './filter/FilterScreen';
import FilterButton from './FilterButton';
import RegionTabsScreen from './RegionTabsScreen';
import RegionTitle from './RegionTitle';

const Stack = createNativeStackNavigator<RegionStackParamsList>();

const searchContexts: SearchContexts = [
  SectionsSearchStringContext,
  SectionsSearchStringSetterContext,
];

const screenOptions: NativeStackNavigationOptions = {
  header: getHeaderRenderer(
    false,
    searchContexts,
    'region:sectionSearchPlaceholder',
  ),
  gestureEnabled: false,
  headerStyle: theme.navigationStyles.headerStyle,
  statusBarStyle: Platform.OS === 'android' ? 'light' : undefined,
};

function RegionStack() {
  return (
    <Stack.Navigator id="RegionStack" screenOptions={screenOptions}>
      <Stack.Screen
        name={Screens.REGION_TABS}
        component={RegionTabsScreen}
        options={{
          headerTitle: () => <RegionTitle />,
          headerRight: () => <FilterButton />,
        }}
      />
      <Stack.Screen name={Screens.FILTER} component={FilterScreen} />
    </Stack.Navigator>
  );
}

export default RegionStack;
