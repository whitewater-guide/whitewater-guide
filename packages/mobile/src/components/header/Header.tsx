import get from 'lodash/get';
import React from 'react';
import { translate } from 'react-i18next';
import { Toolbar, ToolbarAction, ToolbarBackAction, ToolbarContent } from 'react-native-paper';
import { HeaderProps, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { toggleDrawer } from '../../core/actions';
import { WithT } from '../../i18n';

type Props = HeaderProps & WithT & { openDrawer: () => void };

class Header extends React.PureComponent<Props> {

  goBack = () =>
    this.props.navigation.dispatch(NavigationActions.back());

  renderLeftButton = () => {
    const { index } = this.props;
    return index ?
      <ToolbarBackAction onPress={this.goBack} /> :
      <ToolbarAction icon="menu" onPress={this.props.openDrawer} />
    ;
  };

  render() {
    const title = get(this.props, 'scene.descriptor.options.headerTitle', null);
    const right = get(this.props, 'scene.descriptor.options.headerRight', null);
    let titleNode: React.ReactNode = null;
    if (title) {
      titleNode = typeof title === 'string' ? this.props.t(title) : title;
    }
    return (
      <Toolbar>
        {this.renderLeftButton()}
        <ToolbarContent title={titleNode} />
        {right}
      </Toolbar>
    );
  }
}

const container = compose<Props, HeaderProps>(
  connect(undefined, { openDrawer: () => toggleDrawer(null) }),
  translate(),
);

export default container(Header);
