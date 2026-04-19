import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import { getHeaderRenderer } from '../../components/header';
import PlaceholderScreen from '../../components/PlaceholderScreen';
import AddSectionStack from '../../screens/add-section/AddSectionStack';
import {
  AuthMainScreen,
  ForgotScreen,
  RegisterScreen,
  ResetScreen,
  SignInScreen,
  WelcomeScreen,
} from '../../screens/auth';
import { DescentScreen } from '../../screens/descent';
import DescentFormSectionScreen from '../../screens/descent-form/section/DescentFormSectionScreen';
import DescentFormDateScreen from '../../screens/descent-form/date/DescentFormDateScreen';
import DescentFormLevelScreen from '../../screens/descent-form/level/DescentFormLevelScreen';
import DescentFormCommentScreen from '../../screens/descent-form/comment/DescentFormCommentScreen';
import { LogbookScreen } from '../../screens/logbook';
import { MyProfileScreen } from '../../screens/my-profile';
import RegionScreen from '../../screens/region/RegionScreen';
import RegionsListScreen from '../../screens/regions-list';
import SectionScreen from '../../screens/section/SectionScreen';
import theme from '../../theme';
import { useAuth } from '../auth';
import type { RootStackParamsList } from './navigation-params';
import { Screens } from './screen-names';

const Stack = createNativeStackNavigator<RootStackParamsList>();

const topLevelScreenOptions: NativeStackNavigationOptions = {
  header: getHeaderRenderer(true),
  gestureEnabled: false,
  headerStyle: theme.navigationStyles.headerStyle,
  headerTintColor: theme.colors.textLight,
  statusBarStyle: Platform.OS === 'android' ? 'light' : undefined,
};

const innerScreenOptions: NativeStackNavigationOptions = {
  header: getHeaderRenderer(false),
  gestureEnabled: false,
  headerStyle: theme.navigationStyles.headerStyle,
  headerTintColor: theme.colors.textLight,
  statusBarStyle: Platform.OS === 'android' ? 'light' : undefined,
};

const authScreenOptions: NativeStackNavigationOptions = {
  header: getHeaderRenderer(false),
  gestureEnabled: false,
  headerStyle: { backgroundColor: theme.colors.primaryBackground },
  headerTintColor: theme.colors.primary,
  headerTitle: '',
  statusBarStyle: Platform.OS === 'android' ? 'dark' : undefined,
};

function RootStack() {
  const { t } = useTranslation();
  const { me } = useAuth();

  return (
    <Stack.Navigator id="RootStack" screenOptions={topLevelScreenOptions}>
      <Stack.Screen
        name={Screens.REGIONS_LIST}
        component={RegionsListScreen}
        options={{ headerTitle: t('drawer:regions') }}
      />
      <Stack.Screen
        name={Screens.REGION_STACK}
        component={RegionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Screens.SECTION_SCREEN}
        component={SectionScreen}
        options={{ ...innerScreenOptions }}
      />

      <Stack.Screen
        name={Screens.ADD_SECTION_SCREEN}
        component={AddSectionStack}
        options={{ headerShown: false }}
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
      <Stack.Screen
        name={Screens.AUTH_RESET}
        component={ResetScreen}
        options={authScreenOptions}
      />
      {!!me && (
        <>
          <Stack.Screen
            name={Screens.MY_PROFILE}
            component={MyProfileScreen}
            options={{
              ...innerScreenOptions,
              headerTitle: t('drawer:myProfile'),
            }}
          />
          <Stack.Screen
            name={Screens.LOGBOOK}
            component={LogbookScreen}
            options={{
              ...innerScreenOptions,
              headerTitle: t('drawer:logbook'),
            }}
          />
          <Stack.Screen
            name={Screens.DESCENT}
            component={DescentScreen}
            options={{ ...innerScreenOptions }}
          />
          <Stack.Screen
            name={Screens.DESCENT_FORM_SECTION}
            component={DescentFormSectionScreen}
            options={{
              ...innerScreenOptions,
              headerTitle: t('screens:descentForm.section.headerTitle'),
            }}
          />
          <Stack.Screen
            name={Screens.DESCENT_FORM_DATE}
            component={DescentFormDateScreen}
            options={{
              ...innerScreenOptions,
              headerTitle: t('screens:descentForm.date.headerTitle'),
            }}
          />
          <Stack.Screen
            name={Screens.DESCENT_FORM_LEVEL}
            component={DescentFormLevelScreen}
            options={{
              ...innerScreenOptions,
              headerTitle: t('screens:descentForm.level.headerTitle'),
            }}
          />
          <Stack.Screen
            name={Screens.DESCENT_FORM_COMMENT}
            component={DescentFormCommentScreen}
            options={{
              ...innerScreenOptions,
              headerTitle: t('screens:descentForm.comment.headerTitle'),
            }}
          />
        </>
      )}
      {!me && (
        <Stack.Group screenOptions={authScreenOptions}>
          <Stack.Screen name={Screens.AUTH_MAIN} component={AuthMainScreen} />
          <Stack.Screen name={Screens.AUTH_SIGN_IN} component={SignInScreen} />
          <Stack.Screen
            name={Screens.AUTH_REGISTER}
            component={RegisterScreen}
          />
          <Stack.Screen name={Screens.AUTH_FORGOT} component={ForgotScreen} />
          <Stack.Screen name={Screens.AUTH_WELCOME} component={WelcomeScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

export default RootStack;
