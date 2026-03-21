import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import Config from 'react-native-config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { getHeaderRenderer } from './components/header';
import PlaceholderScreen from './components/PlaceholderScreen';
import type { RootStackParamsList } from './core/navigation';
import { Screens } from './core/navigation';
import { I18nProvider } from './i18n';
import AddSectionStack from './screens/add-section/AddSectionStack';
import AuthStack from './screens/auth/AuthStack';
import DescentFormStack from './screens/descent-form/DescentFormStack';
import {
  MockDescentScreen,
  MockLogbookScreen,
  MockRegionsListScreen,
} from './screens/mock';
import theme, { paperTheme } from './theme';

const Stack = createNativeStackNavigator<RootStackParamsList>();

const screenOptions = {
  header: getHeaderRenderer(true),
  gestureEnabled: false,
  animation:
    Config.E2E_MODE === 'true' ? ('none' as const) : ('default' as const),
  headerStyle: theme.navigationStyles.headerStyle,
  headerTintColor: theme.colors.textLight,
};

const innerScreenOptions = {
  header: getHeaderRenderer(false),
  gestureEnabled: false,
  animation:
    Config.E2E_MODE === 'true' ? ('none' as const) : ('default' as const),
  headerStyle: theme.navigationStyles.headerStyle,
  headerTintColor: theme.colors.textLight,
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <PaperProvider theme={paperTheme}>
        <SafeAreaProvider>
          <I18nProvider>
            <NavigationContainer>
              <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              />
              <Stack.Navigator screenOptions={screenOptions}>
                <Stack.Screen
                  name={Screens.REGIONS_LIST}
                  component={MockRegionsListScreen}
                  options={{ headerTitle: 'Regions' }}
                />
                <Stack.Screen
                  name={Screens.REGION_STACK}
                  component={PlaceholderScreen}
                  options={innerScreenOptions}
                />
                <Stack.Screen
                  name={Screens.SECTION_SCREEN}
                  component={PlaceholderScreen}
                  options={innerScreenOptions}
                />
                <Stack.Screen
                  name={Screens.AUTH_STACK}
                  component={AuthStack}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name={Screens.LOGBOOK}
                  component={MockLogbookScreen}
                  options={{ ...innerScreenOptions, headerTitle: 'Logbook' }}
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
                  component={PlaceholderScreen}
                  options={{ ...innerScreenOptions, headerTitle: 'My Profile' }}
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
            </NavigationContainer>
          </I18nProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default App;
