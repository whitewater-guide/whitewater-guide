import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import I18n from '../../i18n';
import { isRouteFocused } from '../../utils/navigation';
import { Separator } from '../Separator';
import AnonHeader from './AnonHeader';
import DrawerItem from './DrawerItem';
import { WithToggle } from './types';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    padding: 4,
    paddingTop: 32,
  },
});

type Props = WithToggle & NavigationInjectedProps;

class DrawerSidebar extends React.PureComponent<Props> {
  navigate = (routeName: string, params: any) => {
    this.props.toggleDrawer(false);
    this.props.navigation.navigate(routeName, params);
  };

  render() {
    const { navigation: { state } } = this.props;
    return (
      <View style={styles.container}>
        <AnonHeader />
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

export default DrawerSidebar;
