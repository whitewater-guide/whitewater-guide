import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Divider, DrawerSection } from 'react-native-paper';
import { NavigationActions, NavigationInjectedProps } from 'react-navigation';
import { compose } from 'recompose';
import { WithT } from '../../i18n';
import { isRouteFocused } from '../../utils/navigation';
import { withMe, WithMe } from '../../ww-clients/features/users';
import { Spacer } from '../Spacer';
import AnonHeader from './AnonHeader';
import DrawerItem from './DrawerItem';
import { WithToggle } from './types';
import UserHeader from './UserHeader';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    padding: 4,
    paddingTop: 32,
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
    const { navigation: { state }, me, t } = this.props;
    return (
      <View style={styles.container}>
        {!!me ? <UserHeader user={me} /> : <AnonHeader />}
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
            icon="list"
            routeName="RegionsList"
            onPress={this.navigate}
            focused={isRouteFocused(state, 'RegionsList')}
          />
          <DrawerItem
            label={t('drawer:faq')}
            icon="help"
            routeName="Plain"
            params={{ fixture: 'faq' }}
            onPress={this.navigate}
            focused={isRouteFocused(state, 'Plain', { fixture: 'faq' })}
          />
        </DrawerSection>
        <Spacer />
        <DrawerItem
          label={t('drawer:termsAndConditions')}
          routeName="Plain"
          params={{ fixture: 'termsAndConditions' }}
          onPress={this.navigate}
          focused={isRouteFocused(state, 'Plain', { fixture: 'termsAndConditions' })}
        />
        <DrawerItem
          label={t('drawer:privacyPolicy')}
          routeName="Plain"
          params={{ fixture: 'privacyPolicy' }}
          onPress={this.navigate}
          focused={isRouteFocused(state, 'Plain', { fixture: 'privacyPolicy' })}
        />
      </View>
    );
  }
}

const DrawerSidebar: React.ComponentType<OuterProps> = compose<InnerProps, OuterProps>(
  withMe,
  translate(),
)(DrawerSidebarView);

export default DrawerSidebar;
