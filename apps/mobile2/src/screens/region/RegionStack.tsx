import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Config from 'react-native-config';

import { getHeaderRenderer } from '../../components/header';
import PlaceholderScreen from '../../components/PlaceholderScreen';
import type { RegionStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import theme from '../../theme';
import RegionTabs from './RegionTabs';

const Stack = createNativeStackNavigator<RegionStackParamsList>();

const screenOptions = {
  header: getHeaderRenderer(false),
  gestureEnabled: false,
  animation:
    Config.E2E_MODE === 'true' ? ('none' as const) : ('default' as const),
  headerStyle: theme.navigationStyles.headerStyle,
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
