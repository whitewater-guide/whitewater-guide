import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import {
  DefaultSectionFilterOptions,
  useSectionsFilterOptions,
} from '@whitewater-guide/clients';
import isEqual from 'lodash/isEqual';
import React, { useCallback } from 'react';
import { Appbar } from 'react-native-paper';

import { Screens } from '../../core/navigation';
import theme from '../../theme';
import type { RegionTabsScreenProps } from './navigation-types';

function FilterButton() {
  const filterOptions = useSectionsFilterOptions();
  const navigation = useNavigation<RegionTabsScreenProps['navigation']>();
  const { dismissAll } = useBottomSheetModal();

  const onPress = useCallback(() => {
    dismissAll();
    setTimeout(() => {
      navigation.navigate(Screens.FILTER);
    }, 100);
  }, [navigation, dismissAll]);

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
}

export default FilterButton;
