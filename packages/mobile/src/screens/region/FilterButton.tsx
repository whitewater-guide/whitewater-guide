import { useFilterState } from '@whitewater-guide/clients';
import Icon from 'components/Icon';
import React, { useCallback } from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import theme from '../../theme';
import Screens from '../screen-names';

const FilterButton: React.FC<NavigationInjectedProps> = ({ navigation }) => {
  const searchTerms = useFilterState();
  const onPress = useCallback(
    () => navigation.navigate(Screens.Filter, navigation.state.params),
    [navigation.navigate],
  );
  const icon = searchTerms ? 'filter' : 'filter-outline';
  return (
    <Icon
      icon={icon}
      color={theme.colors.textLight}
      onPress={onPress}
      testID="region-filter-btn"
    />
  );
};

export default FilterButton;
