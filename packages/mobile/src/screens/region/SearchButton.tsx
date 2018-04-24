import React from 'react';
import { Icon } from '../../components';
import theme from '../../theme';

class SearchButton extends React.PureComponent {
  render() {
    return (
      <Icon icon="search" color={theme.colors.textLight} />
    );
  }
}

export default SearchButton;
