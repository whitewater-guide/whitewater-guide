import { useAuth } from '@whitewater-guide/clients';
import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { NavigationActions } from 'react-navigation';
import Screens from '../../screens/screen-names';
import theme from '../../theme';
import { isRouteFocused } from '../../utils/navigation';
import { Logo } from '../Logo';
import { Spacer } from '../Spacer';
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
    (routeName: string, params: any) => {
      toggleDrawer(false);
      if (navigation) {
        navigation.dispatch(NavigationActions.navigate({ routeName, params }));
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
          routeName="MyProfile"
          onPress={navigate}
          focused={isRouteFocused(state, 'MyProfile')}
        />
      )}
      {!me && (
        <DrawerItem
          label={t('drawer:signIn')}
          icon="exit-to-app"
          routeName={Screens.Auth.Main}
          onPress={navigate}
          focused={isRouteFocused(state, Screens.Auth.Main)}
        />
      )}
      <DrawerItem
        label={t('drawer:regions')}
        icon="view-list"
        routeName="RegionsList"
        onPress={navigate}
        focused={isRouteFocused(state, 'RegionsList')}
      />
      <DrawerItem
        label={t('drawer:faq')}
        icon="help"
        routeName={Screens.Plain}
        params={{ fixture: 'faq', title: t('drawer:faq') }}
        onPress={navigate}
        focused={isRouteFocused(state, Screens.Plain, { fixture: 'faq' })}
      />
      <Spacer />
      <DrawerItem
        label={t('commons:termsOfService')}
        routeName={Screens.Plain}
        params={{
          fixture: 'termsAndConditions',
          title: t('commons:termsOfService'),
        }}
        onPress={navigate}
        focused={isRouteFocused(state, Screens.Plain, {
          fixture: 'termsAndConditions',
        })}
      />
      <DrawerItem
        label={t('commons:privacyPolicy')}
        routeName={Screens.Plain}
        params={{
          fixture: 'privacyPolicy',
          title: t('commons:privacyPolicy'),
        }}
        onPress={navigate}
        focused={isRouteFocused(state, Screens.Plain, {
          fixture: 'privacyPolicy',
        })}
      />
      <VersionBadge />
      <SafeAreaView />
    </View>
  );
};

export default DrawerSidebar;
