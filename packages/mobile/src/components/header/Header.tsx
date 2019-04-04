import get from 'lodash/get';
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Appbar } from 'react-native-paper';
import { HeaderProps, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { toggleDrawer } from '../../core/actions';
import { HeaderRight } from '../../screens';

type Props = HeaderProps & WithTranslation & { openDrawer: () => void };

class Header extends React.PureComponent<Props> {
  goBack = () => this.props.navigation.dispatch(NavigationActions.back());

  renderLeftButton = () => {
    const { index, openDrawer } = this.props;
    return index ? (
      <Appbar.Action icon="chevron-left" size={36} onPress={this.goBack} />
    ) : (
      <Appbar.Action icon="menu" onPress={openDrawer} />
    );
  };

  render() {
    const title = get(this.props, 'scene.descriptor.options.headerTitle', null);
    let titleNode: React.ReactNode = null;
    if (title) {
      titleNode = typeof title === 'string' ? this.props.t(title) : title;
    }
    return (
      <Appbar.Header>
        {this.renderLeftButton()}
        <Appbar.Content title={titleNode} />
        <HeaderRight navigation={this.props.navigation} />
      </Appbar.Header>
    );
  }
}

const container = compose<Props, HeaderProps>(
  connect(
    undefined,
    { openDrawer: () => toggleDrawer(null) },
  ),
  withTranslation(),
);

export default container(Header);
