import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { getHeaderRenderer } from '../../components/header';
import PlaceholderScreen from '../../components/PlaceholderScreen';
import AddSectionStack from '../../screens/add-section/AddSectionStack';
import AuthStack from '../../screens/auth/AuthStack';
import DescentFormStack from '../../screens/descent-form/DescentFormStack';
import {
  MockDescentScreen,
  MockLogbookScreen,
  MockMyProfileScreen,
  MockRegionsListScreen,
} from '../../screens/mock';
import RegionStack from '../../screens/region/RegionStack';
import SectionTabs from '../../screens/section/SectionTabs';
import theme from '../../theme';
import type { RootStackParamsList } from './navigation-params';
import { Screens } from './screen-names';

const Stack = createNativeStackNavigator<RootStackParamsList>();

const topLevelScreenOptions: NativeStackNavigationOptions = {
  header: getHeaderRenderer(true),
  gestureEnabled: false,
  headerStyle: theme.navigationStyles.headerStyle,
  headerTintColor: theme.colors.textLight,
};

const innerScreenOptions: NativeStackNavigationOptions = {
  header: getHeaderRenderer(false),
  gestureEnabled: false,
  headerStyle: theme.navigationStyles.headerStyle,
  headerTintColor: theme.colors.textLight,
};

function RootStack() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator id="RootStack" screenOptions={topLevelScreenOptions}>
      <Stack.Screen
        name={Screens.REGIONS_LIST}
        component={MockRegionsListScreen}
        options={{ headerTitle: t('drawer:regions') }}
      />
      <Stack.Screen
        name={Screens.REGION_STACK}
        component={RegionStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Screens.SECTION_SCREEN}
        component={SectionTabs}
        options={{ ...innerScreenOptions, headerTitle: 'Section' }}
      />
      <Stack.Screen
        name={Screens.AUTH_STACK}
        component={AuthStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Screens.LOGBOOK}
        component={MockLogbookScreen}
        options={{ ...innerScreenOptions, headerTitle: t('drawer:logbook') }}
      />
      <Stack.Screen
        name={Screens.DESCENT}
        component={MockDescentScreen}
        options={{ ...innerScreenOptions, headerTitle: 'Descent' }}
      />
      <Stack.Screen
        name={Screens.DESCENT_FORM}
        component={DescentFormStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Screens.ADD_SECTION_SCREEN}
        component={AddSectionStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Screens.MY_PROFILE}
        component={MockMyProfileScreen}
        options={{ ...innerScreenOptions, headerTitle: t('drawer:myProfile') }}
      />
      <Stack.Screen
        name={Screens.CONNECT_EMAIL_REQUEST}
        component={PlaceholderScreen}
        options={innerScreenOptions}
      />
      <Stack.Screen
        name={Screens.CONNECT_EMAIL}
        component={PlaceholderScreen}
        options={innerScreenOptions}
      />
      <Stack.Screen
        name={Screens.CONNECT_EMAIL_SUCCESS}
        component={PlaceholderScreen}
        options={innerScreenOptions}
      />
      <Stack.Screen
        name={Screens.PLAIN}
        component={PlaceholderScreen}
        options={innerScreenOptions}
      />
      <Stack.Screen
        name={Screens.WEB_VIEW}
        component={PlaceholderScreen}
        options={innerScreenOptions}
      />
      <Stack.Screen
        name={Screens.LICENSE}
        component={PlaceholderScreen}
        options={innerScreenOptions}
      />
      <Stack.Screen
        name={Screens.SUGGESTION}
        component={PlaceholderScreen}
        options={innerScreenOptions}
      />
    </Stack.Navigator>
  );
}

export default RootStack;
