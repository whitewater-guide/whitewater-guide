import React from 'react';
import { useTranslation } from 'react-i18next';
import useEffectOnce from 'react-use/lib/useEffectOnce';
import ErrorBoundary from '~/components/ErrorBoundary';
import FilterScreenView from './FilterScreenView';
import ResetFilterButton from './ResetFilterButton';
import { FilterNavProps } from './types';

const FilterScreen: React.FC<FilterNavProps> = ({ navigation }) => {
  const { t } = useTranslation();
  useEffectOnce(() => {
    navigation.setOptions({
      headerTitle: t('filter:title'),
      headerRight: () => <ResetFilterButton />,
    });
  });
  return (
    <ErrorBoundary>
      <FilterScreenView />
    </ErrorBoundary>
  );
};

export default FilterScreen;
