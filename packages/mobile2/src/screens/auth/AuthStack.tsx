import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Config from 'react-native-config';

import { getHeaderRenderer } from '../../components/header';
import PlaceholderScreen from '../../components/PlaceholderScreen';
import type { AuthStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import theme from '../../theme';
import {
  MockAuthForgotScreen,
  MockAuthMainScreen,
  MockAuthRegisterScreen,
  MockAuthSignInScreen,
} from '../mock';

const Stack = createNativeStackNavigator<AuthStackParamsList>();

const screenOptions = {
  header: getHeaderRenderer(false),
  gestureEnabled: false,
  animation:
    Config.E2E_MODE === 'true' ? ('none' as const) : ('default' as const),
  headerStyle: theme.navigationStyles.headerStyle,
};

function AuthStack() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name={Screens.AUTH_MAIN}
        component={MockAuthMainScreen}
        options={{ headerTitle: t('screens:auth.main.signin') }}
      />
      <Stack.Screen
        name={Screens.AUTH_SIGN_IN}
        component={MockAuthSignInScreen}
        options={{ headerTitle: t('screens:auth.signin.submit') }}
      />
      <Stack.Screen
        name={Screens.AUTH_REGISTER}
        component={MockAuthRegisterScreen}
        options={{ headerTitle: t('screens:auth.register.title') }}
      />
      <Stack.Screen
        name={Screens.AUTH_FORGOT}
        component={MockAuthForgotScreen}
        options={{ headerTitle: t('screens:auth.forgot.title') }}
      />
      <Stack.Screen
        name={Screens.AUTH_RESET}
        component={PlaceholderScreen}
        options={{ headerTitle: t('screens:auth.reset.title') }}
      />
      <Stack.Screen name={Screens.AUTH_SOCIAL} component={PlaceholderScreen} />
      <Stack.Screen name={Screens.AUTH_WELCOME} component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}

export default AuthStack;
