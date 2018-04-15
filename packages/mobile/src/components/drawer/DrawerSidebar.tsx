import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import I18n from '../../i18n';
import { isRouteFocused } from '../../utils/navigation';
import { withMe, WithMe } from '../../ww-clients/features/users';
import { Separator } from '../Separator';
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
type InnerProps = OuterProps & WithMe;

class DrawerSidebarView extends React.PureComponent<InnerProps> {
  navigate = (routeName: string, params: any) => {
    this.props.toggleDrawer(false);
    this.props.navigation.navigate(routeName, params);
  };

  render() {
    const { navigation: { state }, me } = this.props;
    return (
      <View style={styles.container}>
        {!!me ? <UserHeader user={me} /> : <AnonHeader />}
        <Separator />
        <DrawerItem
          label={I18n.t('drawer.regions')}
          routeName="RegionsList"
          onPress={this.navigate}
          focused={isRouteFocused(state, 'RegionsList')}
        />
        <DrawerItem
          label={I18n.t('drawer.faq')}
          routeName="Plain"
          params={{ fixture: 'faq' }}
          onPress={this.navigate}
          focused={isRouteFocused(state, 'Plain', { fixture: 'faq' })}
        />
        <DrawerItem
          label={I18n.t('drawer.termsAndConditions')}
          routeName="Plain"
          params={{ fixture: 'termsAndConditions' }}
          onPress={this.navigate}
          focused={isRouteFocused(state, 'Plain', { fixture: 'termsAndConditions' })}
        />
        <DrawerItem
          label={I18n.t('drawer.privacyPolicy')}
          routeName="Plain"
          params={{ fixture: 'privacyPolicy' }}
          onPress={this.navigate}
          focused={isRouteFocused(state, 'Plain', { fixture: 'privacyPolicy' })}
        />
      </View>
    );
  }
}

const DrawerSidebar: React.ComponentType<OuterProps> = withMe(DrawerSidebarView);

export default DrawerSidebar;
