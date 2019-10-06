import { useAuth } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { NavigationActions } from 'react-navigation';
import { useNavigation } from 'react-navigation-hooks';
import Screens from '../../screens/screen-names';
import theme from '../../theme';
import { isRouteFocused } from '../../utils/navigation';
import Logo from '../Logo';
import Spacer from '../Spacer';
import { useDrawer } from './DrawerContext';
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

const DrawerSidebar: React.FC = () => {
  const navigation = useNavigation();
  const toggleDrawer = useDrawer();
  const navigate = useCallback(
    (routeName: string, params: any, key?: string) => {
      toggleDrawer(false);
      if (navigation) {
        navigation.dispatch(
          NavigationActions.navigate({ routeName, params, key }),
        );
      }
    },
    [toggleDrawer, navigation],
  );
  const [t] = useTranslation();
  const { me } = useAuth();
  const state = navigation ? navigation.state : null;
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
          routeName={Screens.MyProfile}
          onPress={navigate}
          focused={isRouteFocused(state, Screens.MyProfile)}
        />
      )}
      {!me && (
        <DrawerItem
          label={t('drawer:signIn')}
          icon="exit-to-app"
          routeName={Screens.Auth.Root}
          onPress={navigate}
          navKey={Screens.Auth.Root}
          focused={isRouteFocused(state, Screens.Auth.Root)}
        />
      )}
      <DrawerItem
        label={t('drawer:regions')}
        icon="view-list"
        routeName={Screens.RegionsList}
        onPress={navigate}
        focused={isRouteFocused(state, Screens.RegionsList)}
      />
      <DrawerItem
        label={t('drawer:faq')}
        icon="help"
        routeName={Screens.WebView}
        params={{ fixture: 'faq', title: t('drawer:faq') }}
        onPress={navigate}
        focused={isRouteFocused(state, Screens.WebView, { fixture: 'faq' })}
      />
      <Spacer />
      <DrawerItem
        label={t('commons:termsOfService')}
        routeName={Screens.WebView}
        params={{
          fixture: 'terms_and_conditions',
          title: t('commons:termsOfService'),
        }}
        onPress={navigate}
        focused={isRouteFocused(state, Screens.WebView, {
          fixture: 'terms_and_conditions',
        })}
      />
      <DrawerItem
        label={t('commons:privacyPolicy')}
        routeName={Screens.WebView}
        params={{
          fixture: 'privacy_policy',
          title: t('commons:privacyPolicy'),
        }}
        onPress={navigate}
        focused={isRouteFocused(state, Screens.WebView, {
          fixture: 'privacy_policy',
        })}
      />
      <VersionBadge />
      <SafeAreaView />
    </View>
  );
};

export default DrawerSidebar;
