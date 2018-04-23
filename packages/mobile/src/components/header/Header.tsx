import React from 'react';
import Hamburger from 'react-native-hamburger';
import { Toolbar, ToolbarContent } from 'react-native-paper';
import { HeaderProps, NavigationActions } from 'react-navigation';
import theme from '../../theme';

class Header extends React.PureComponent<HeaderProps> {

  onLeftButton = () => {
    const { navigation, index } = this.props;
    if (index) {
      navigation.dispatch(NavigationActions.back());
    }
  };

  renderLeftButton = () => {
    const { index } = this.props;
    return (
      <Hamburger
        onPress={this.onLeftButton}
        color={theme.colors.textLight}
        type="arrow"
        active={index === 0}
      />
    );
  };

  render() {
    return (
      <Toolbar>
        {this.renderLeftButton()}
        <ToolbarContent title="hi" />
      </Toolbar>
    );
  }
}

export default Header;
