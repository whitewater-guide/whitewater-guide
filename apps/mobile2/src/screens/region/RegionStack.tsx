import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

import { getHeaderRenderer } from '../../components/header';
import PlaceholderScreen from '../../components/PlaceholderScreen';
import type { RegionStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import theme from '../../theme';
import RegionTabs from './RegionTabs';

const Stack = createNativeStackNavigator<RegionStackParamsList>();

const screenOptions: NativeStackNavigationOptions = {
  header: getHeaderRenderer(false),
  gestureEnabled: false,
  headerStyle: theme.navigationStyles.headerStyle,
  statusBarStyle: Platform.OS === 'android' ? 'light' : undefined,
};

function RegionStack() {
  return (
    <Stack.Navigator id="RegionStack" screenOptions={screenOptions}>
      <Stack.Screen
        name={Screens.REGION_TABS}
        component={RegionTabs}
        options={{ headerTitle: 'Region' }}
      />
      <Stack.Screen
        name={Screens.FILTER}
        component={PlaceholderScreen}
        options={{ headerTitle: 'Filter' }}
      />
    </Stack.Navigator>
  );
}

export default RegionStack;
