import { useNavigation } from '@react-navigation/native';
import { useSectionsFilterOptionsSetter } from '@whitewater-guide/clients';
import { DefaultSectionFilterOptions } from '@whitewater-guide/commons';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import theme from '../../../theme';

const ResetFilterButton: React.FC = () => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const setFilterOptions = useSectionsFilterOptionsSetter();
  const onPress = useCallback(() => {
    setFilterOptions(DefaultSectionFilterOptions);
    goBack();
  }, [setFilterOptions, goBack]);
  return (
    <Button compact={true} color={theme.colors.textLight} onPress={onPress}>
      {t('filter:reset')}
    </Button>
  );
};

export default ResetFilterButton;
