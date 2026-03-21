import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import theme from '../../theme';
import { useAuth } from '../auth';
import DrawerItem from './DrawerItem';
import { Screens } from './screen-names';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    padding: theme.margin.half,
    paddingTop: theme.margin.double,
  },
  spacer: {
    flex: 1,
  },
});

function DrawerSidebar({ navigation }: DrawerContentComponentProps) {
  const { t } = useTranslation();

  const navigate = useCallback(
    (name: string, params?: Record<string, unknown>) => {
      navigation.closeDrawer();
      navigation.navigate(Screens.ROOT_STACK, {
        screen: name,
        params,
      });
    },
    [navigation],
  );

  const reset = useCallback(
    (name: string, params?: Record<string, unknown>) => {
      navigation.closeDrawer();
      navigation.reset({
        index: 0,
        routes: [
          {
            name: Screens.ROOT_STACK,
            params: { screen: name, params },
          },
        ],
      });
    },
    [navigation],
  );

  const { me } = useAuth();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Divider />
      {me ? (
        <DrawerItem
          label={t('drawer:myProfile')}
          icon="account-circle"
          routeName={Screens.MY_PROFILE}
          onPress={navigate}
          testID="drawer:my-profile"
        />
      ) : (
        <DrawerItem
          label={t('drawer:signIn')}
          icon="exit-to-app"
          routeName={Screens.AUTH_STACK}
          onPress={navigate}
          testID="drawer:sign-in"
        />
      )}
      <DrawerItem
        label={t('drawer:regions')}
        icon="view-list"
        routeName={Screens.REGIONS_LIST}
        onPress={reset}
        testID="drawer:regions"
      />
      <DrawerItem
        label={t('drawer:logbook')}
        icon="notebook"
        routeName={me ? Screens.LOGBOOK : Screens.AUTH_STACK}
        onPress={me ? reset : navigate}
        testID="drawer:logbook"
      />
      <DrawerItem
        label={t('drawer:faq')}
        icon="help"
        routeName={Screens.WEB_VIEW}
        params={{ fixture: 'faq', title: t('drawer:faq') }}
        onPress={navigate}
        testID="drawer:faq"
      />
      <View style={styles.spacer} />
      <DrawerItem
        label={t('commons:backers')}
        routeName={Screens.WEB_VIEW}
        params={{ fixture: 'backers', title: t('commons:backers') }}
        onPress={navigate}
        testID="drawer:backers"
      />
      <DrawerItem
        label={t('commons:termsOfService')}
        routeName={Screens.WEB_VIEW}
        params={{
          fixture: 'terms_and_conditions',
          title: t('commons:termsOfService'),
        }}
        onPress={navigate}
        testID="drawer:terms"
      />
      <DrawerItem
        label={t('commons:privacyPolicy')}
        routeName={Screens.WEB_VIEW}
        params={{
          fixture: 'privacy_policy',
          title: t('commons:privacyPolicy'),
        }}
        onPress={navigate}
        testID="drawer:privacy"
      />
    </SafeAreaView>
  );
}

export default DrawerSidebar;
