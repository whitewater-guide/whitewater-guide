import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import {
  DefaultSectionFilterOptions,
  useSectionsFilterOptions,
} from '@whitewater-guide/clients';
import isEqual from 'lodash/isEqual';
import React, { useCallback } from 'react';
import { Appbar } from 'react-native-paper';

import { Screens } from '~/core/navigation';
import theme from '~/theme';

import { RegionTabsNavProp } from './types';

const FilterButton: React.FC = () => {
  const filterOptions = useSectionsFilterOptions();
  const { navigate } = useNavigation<RegionTabsNavProp>();
  const { dismissAll } = useBottomSheetModal();

  const onPress = useCallback(() => {
    dismissAll();
    setTimeout(() => {
      navigate(Screens.FILTER);
    }, 100);
  }, [navigate, dismissAll]);

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
