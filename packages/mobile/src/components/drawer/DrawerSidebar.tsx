import { useAuth } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Divider, Drawer } from 'react-native-paper';
import { NavigationActions, NavigationInjectedProps } from 'react-navigation';
import { isRouteFocused } from '../../utils/navigation';
import { Spacer } from '../Spacer';
import DrawerHeader from './DrawerHeader';
import DrawerItem from './DrawerItem';
import { WithToggle } from './types';
import VersionBadge from './VersionBadge';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    padding: 4,
    paddingTop: 32,
  },
});

type Props = WithToggle & NavigationInjectedProps;

const DrawerSidebar: React.FC<Props> = ({ navigation, toggleDrawer }) => {
  const { state, dispatch } = navigation;
  const navigate = useCallback(
    (routeName: string, params: any) => {
      toggleDrawer(false);
      navigation.dispatch(NavigationActions.navigate({ routeName, params }));
    },
    [toggleDrawer, dispatch],
  );
  const [t] = useTranslation();
  const { me } = useAuth();
  return (
    <View style={styles.container}>
      <DrawerHeader />
      <Divider />
      <Drawer.Section>
        {!!me && (
          <DrawerItem
            label={t('drawer:myProfile')}
            icon="settings"
            routeName="MyProfile"
            onPress={navigate}
            focused={isRouteFocused(state, 'MyProfile')}
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
          routeName="Plain"
          params={{ fixture: 'faq', title: t('drawer:faq') }}
          onPress={navigate}
          focused={isRouteFocused(state, 'Plain', { fixture: 'faq' })}
        />
      </Drawer.Section>
      <Spacer />
      <DrawerItem
        label={t('drawer:termsAndConditions')}
        routeName="Plain"
        params={{
          fixture: 'termsAndConditions',
          title: t('drawer:termsAndConditions'),
        }}
        onPress={navigate}
        focused={isRouteFocused(state, 'Plain', {
          fixture: 'termsAndConditions',
        })}
      />
      <DrawerItem
        label={t('drawer:privacyPolicy')}
        routeName="Plain"
        params={{
          fixture: 'privacyPolicy',
          title: t('drawer:privacyPolicy'),
        }}
        onPress={navigate}
        focused={isRouteFocused(state, 'Plain', {
          fixture: 'privacyPolicy',
        })}
      />
      <VersionBadge />
    </View>
  );
};

export default DrawerSidebar;
