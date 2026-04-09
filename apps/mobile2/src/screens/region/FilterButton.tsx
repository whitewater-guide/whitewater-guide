import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  DefaultSectionFilterOptions,
  useSectionsFilterOptions,
} from '@whitewater-guide/clients';
import isEqual from 'lodash/isEqual';
import React, { useCallback } from 'react';
import { Appbar } from 'react-native-paper';

import type { RegionStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import theme from '../../theme';

function FilterButton() {
  const filterOptions = useSectionsFilterOptions();
  const navigation =
    useNavigation<NativeStackNavigationProp<RegionStackParamsList>>();
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
