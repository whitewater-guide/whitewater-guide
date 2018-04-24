import React from 'react';
import { Icon } from '../../components';
import theme from '../../theme';

class FilterButton extends React.PureComponent {
  render() {
    return (
      <Icon icon="funnel" color={theme.colors.textLight} />
    );
  }
}

export default FilterButton;
