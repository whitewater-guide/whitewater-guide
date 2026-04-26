import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';

import theme from '../../../theme';

interface Props {
  isBusy: boolean;
  onPress: () => void;
}

function BackButton({ isBusy, onPress }: Props) {
  const { t } = useTranslation();

  return (
    <Button
      textColor={theme.colors.textLight}
      onPress={onPress}
      disabled={isBusy}
      accessibilityLabel={t('commons:done')}
      testID="add-section-photo-done-btn"
    >
      {t('commons:done')}
    </Button>
  );
}

export default memo(BackButton);
