import React from 'react';
import { NavigationSceneRendererProps } from 'react-navigation';
import { Icon } from '../../components';
import theme from '../../theme';
import { consumeRegion, RegionState } from '@whitewater-guide/clients';

type Props = Pick<NavigationSceneRendererProps, 'navigation'> &
  Pick<RegionState, 'searchTerms'>;

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
