import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { Icon } from '../../components';
import theme from '../../theme';

class FilterButton extends React.PureComponent<NavigationInjectedProps> {
  onPress = () => this.props.navigation.navigate('Filter');

  render() {
    return (
      <Icon icon="filter" color={theme.colors.textLight} onPress={this.onPress} />
    );
  }
}

export default FilterButton;
