import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';

import theme from '../../../theme';
import type { ShapeScreenProps } from './navigation-types';

interface Props {
  disabled: boolean;
}

function DoneButton({ disabled }: Props) {
  const { goBack } = useNavigation<ShapeScreenProps['navigation']>();
  const { t } = useTranslation();
  const onPress = useCallback(() => goBack(), [goBack]);
  return (
    <Button
      textColor={theme.colors.textLight}
      disabled={disabled}
      onPress={onPress}
      accessibilityLabel={t('commons:done')}
      testID="add-section-shape-done-btn"
    >
      {t('commons:done')}
    </Button>
  );
}

export default DoneButton;
