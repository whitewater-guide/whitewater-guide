import React from 'react';
import { translate } from 'react-i18next';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import { Divider, DrawerSection } from 'react-native-paper';
import { NavigationActions, NavigationInjectedProps } from 'react-navigation';
import { compose } from 'recompose';
import { WithT } from '../../i18n';
import { isRouteFocused } from '../../utils/navigation';
import { withMe, WithMe } from '../../ww-clients/features/users';
import { Spacer } from '../Spacer';
import DrawerHeader from './DrawerHeader';
import DrawerItem from './DrawerItem';
import { WithToggle } from './types';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    padding: 4,
    paddingTop: 32,
  },
  versionText: {
    marginLeft: 16,
    fontSize: 10,
    color: 'rgba(0,0,0,0.32)',
  },
});

type OuterProps = WithToggle & NavigationInjectedProps;
type InnerProps = OuterProps & WithMe & WithT;

class DrawerSidebarView extends React.PureComponent<InnerProps> {
  navigate = (routeName: string, params: any) => {
    this.props.toggleDrawer(false);
    this.props.navigation.dispatch(NavigationActions.navigate({ routeName, params }));
  };

  render() {
    const { navigation: { state }, me, meLoading, t } = this.props;
    const version = DeviceInfo.getVersion();
    const build = DeviceInfo.getBuildNumber();
    let versionStr = Platform.OS === 'ios' ? `${version} (${build})` : version;
    versionStr += ` ${Config.ENV_NAME}`;
    return (
      <View style={styles.container}>
        <DrawerHeader me={me} meLoading={meLoading} />
        <Divider />
        <DrawerSection>
          {
            !!me &&
            (
              <DrawerItem
                label={t('drawer:myProfile')}
                icon="settings"
                routeName="MyProfile"
                onPress={this.navigate}
                focused={isRouteFocused(state, 'MyProfile')}
              />
            )
          }
          <DrawerItem
            label={t('drawer:regions')}
            icon="view-list"
            routeName="RegionsList"
            onPress={this.navigate}
            focused={isRouteFocused(state, 'RegionsList')}
          />
          <DrawerItem
            label={t('drawer:faq')}
            icon="help"
            routeName="Plain"
            params={{ fixture: 'faq', title: t('drawer:faq') }}
            onPress={this.navigate}
            focused={isRouteFocused(state, 'Plain', { fixture: 'faq' })}
          />
        </DrawerSection>
        <Spacer />
        <DrawerItem
          label={t('drawer:termsAndConditions')}
          routeName="Plain"
          params={{ fixture: 'termsAndConditions', title: t('drawer:termsAndConditions') }}
          onPress={this.navigate}
          focused={isRouteFocused(state, 'Plain', { fixture: 'termsAndConditions' })}
        />
        <DrawerItem
          label={t('drawer:privacyPolicy')}
          routeName="Plain"
          params={{ fixture: 'privacyPolicy', title: t('drawer:privacyPolicy') }}
          onPress={this.navigate}
          focused={isRouteFocused(state, 'Plain', { fixture: 'privacyPolicy' })}
        />
        <Text style={styles.versionText}>{`v${versionStr}`}</Text>
      </View>
    );
  }
}

const DrawerSidebar: React.ComponentType<OuterProps> = compose<InnerProps, OuterProps>(
  withMe,
  translate(),
)(DrawerSidebarView);

export default DrawerSidebar;
