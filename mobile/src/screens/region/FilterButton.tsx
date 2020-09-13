import { useNavigation } from '@react-navigation/native';
import { useSectionsFilterOptions } from '@whitewater-guide/clients';
import { DefaultSectionFilterOptions } from '@whitewater-guide/commons';
import isEqual from 'lodash/isEqual';
import React, { useCallback } from 'react';
import { Appbar } from 'react-native-paper';

import { RootStackNav, Screens } from '~/core/navigation';
import theme from '~/theme';

const FilterButton: React.FC = () => {
  const filterOptions = useSectionsFilterOptions();
  const { navigate } = useNavigation<RootStackNav>();
  const onPress = useCallback(() => navigate(Screens.FILTER), [navigate]);
  const icon = isEqual(filterOptions, DefaultSectionFilterOptions)
    ? 'filter-outline'
    : 'filter';
  return (
    <Appbar.Action
      icon={icon}
      color={theme.colors.textLight}
      onPress={onPress}
      testID="region-filter-btn"
    />
  );
};

export default FilterButton;
