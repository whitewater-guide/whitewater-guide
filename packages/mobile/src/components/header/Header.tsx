import get from 'lodash/get';
import React from 'react';
import { translate } from 'react-i18next';
import { Platform } from 'react-native';
import { Toolbar, ToolbarAction, ToolbarContent } from 'react-native-paper';
import { HeaderProps, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { toggleDrawer } from '../../core/actions';
import { WithT } from '../../i18n';
import { HeaderRight } from '../../screens';

type Props = HeaderProps & WithT & { openDrawer: () => void };

class Header extends React.PureComponent<Props> {

  goBack = () =>
    this.props.navigation.dispatch(NavigationActions.back());

  renderLeftButton = () => {
    const { index } = this.props;
    const backProps = Platform.select({
      ios: {
        icon: 'chevron-left',
        size: 36,
      },
      android: {
        icon: 'arrow-back',
        size: 24,
      },
    });
    return index ?
      <ToolbarAction {...backProps} onPress={this.goBack} /> :
      <ToolbarAction icon="menu" onPress={this.props.openDrawer} />
    ;
  };

  render() {
    const title = get(this.props, 'scene.descriptor.options.headerTitle', null);
    let titleNode: React.ReactNode = null;
    if (title) {
      titleNode = typeof title === 'string' ? this.props.t(title) : title;
    }
    return (
      <Toolbar>
        {this.renderLeftButton()}
        <ToolbarContent title={titleNode} />
        <HeaderRight navigation={this.props.navigation} />
      </Toolbar>
    );
  }
}

const container = compose<Props, HeaderProps>(
  connect(undefined, { openDrawer: () => toggleDrawer(null) }),
  translate(),
);

export default container(Header);
