import { consumeRegion, RegionState } from '@whitewater-guide/clients';
import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { Icon } from '../../components';
import theme from '../../theme';

type Props = NavigationInjectedProps & Pick<RegionState, 'searchTerms'>;

class FilterButton extends React.PureComponent<Props> {
  onPress = () => this.props.navigation.navigate('Filter');

  render() {
    const icon = this.props.searchTerms ? 'filter' : 'filter-outline';
    return (
      <Icon icon={icon} color={theme.colors.textLight} onPress={this.onPress} />
    );
  }
}

export default consumeRegion(({ searchTerms }) => ({ searchTerms }))(
  FilterButton,
);
