import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import ErrorBoundary from '../../../components/ErrorBoundary';
import FilterScreenView from './FilterScreenView';
import type { FilterScreenProps } from './navigation-types';
import ResetFilterButton from './ResetFilterButton';

function FilterScreen({ navigation }: FilterScreenProps) {
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
