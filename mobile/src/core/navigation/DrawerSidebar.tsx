import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAuth } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Divider } from 'react-native-paper';

import Logo from '~/components/Logo';
import Spacer from '~/components/Spacer';
import { Screens } from '~/core/navigation';
import theme from '~/theme';

import DrawerItem from './DrawerItem';
import VersionBadge from './VersionBadge';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'white',
    padding: 4,
    paddingTop: theme.margin.double,
  },
  logoWrapper: {
    margin: theme.margin.double,
  },
});

const DrawerSidebar: React.FC<DrawerContentComponentProps> = (props) => {
  const { navigation } = props;

  const navigate = useCallback(
    (name: string, params: any, key?: string) => {
      (navigation as any).closeDrawer();
      navigation.navigate({ name, key, params });
    },
    [navigation],
  );

  const reset = useCallback(
    (name: string, params: any, key?: string) => {
      (navigation as any).closeDrawer();
      navigation.reset({
        index: 0,
        routes: [{ name, key, params }],
      });
    },
    [navigation],
  );

  const [t] = useTranslation();
  const { me } = useAuth();
  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View style={styles.logoWrapper}>
        <Logo />
      </View>
      <Divider />
      {!!me && (
        <DrawerItem
          label={t('drawer:myProfile')}
          icon="account-circle"
          routeName={Screens.MY_PROFILE}
          onPress={navigate}
        />
      )}
      {!me && (
        <DrawerItem
          label={t('drawer:signIn')}
          icon="exit-to-app"
          routeName={Screens.AUTH_STACK}
          onPress={navigate}
          navKey={Screens.AUTH_STACK}
        />
      )}
      <DrawerItem
        label={t('drawer:regions')}
        icon="view-list"
        routeName={Screens.REGIONS_LIST}
        onPress={reset}
      />
      <DrawerItem
        label={t('drawer:logbook')}
        icon="notebook"
        routeName={me ? Screens.LOGBOOK : Screens.AUTH_STACK}
        onPress={me ? reset : navigate}
        navKey={me ? undefined : Screens.AUTH_STACK}
      />
      <DrawerItem
        label={t('drawer:faq')}
        icon="help"
        routeName={Screens.WEB_VIEW}
        params={{ fixture: 'faq', title: t('drawer:faq') }}
        onPress={navigate}
      />
      <Spacer />
      <DrawerItem
        label={t('commons:backers')}
        routeName={Screens.WEB_VIEW}
        params={{
          fixture: 'backers',
          title: t('commons:backers'),
        }}
        onPress={navigate}
      />
      <DrawerItem
        label={t('commons:termsOfService')}
        routeName={Screens.WEB_VIEW}
        params={{
          fixture: 'terms_and_conditions',
          title: t('commons:termsOfService'),
        }}
        onPress={navigate}
      />
      <DrawerItem
        label={t('commons:privacyPolicy')}
        routeName={Screens.WEB_VIEW}
        params={{
          fixture: 'privacy_policy',
          title: t('commons:privacyPolicy'),
        }}
        onPress={navigate}
      />
      <VersionBadge />
      <SafeAreaView />
    </View>
  );
};

export default DrawerSidebar;
