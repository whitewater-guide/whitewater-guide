import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import ErrorBoundary from '../../../components/ErrorBoundary';
import type { RegionStackParamsList , Screens } from '../../../core/navigation';
import FilterScreenView from './FilterScreenView';
import ResetFilterButton from './ResetFilterButton';

type Props = NativeStackScreenProps<
  RegionStackParamsList,
  typeof Screens.FILTER
>;

function FilterScreen({ navigation }: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: t('filter:title'),
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => <ResetFilterButton />,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorBoundary>
      <FilterScreenView />
    </ErrorBoundary>
  );
}

export default FilterScreen;
