import { useFilterSetteer } from '@whitewater-guide/clients';
import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import theme from '../../theme';

const ResetFilterButton: React.FC = () => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const setSearchTerms = useFilterSetteer();
  const onPress = useCallback(() => {
    setSearchTerms(null);
    goBack();
  }, [setSearchTerms, goBack]);
  return (
    <Button compact={true} color={theme.colors.textLight} onPress={onPress}>
      {t('filter:reset')}
    </Button>
  );
};

export default ResetFilterButton;
