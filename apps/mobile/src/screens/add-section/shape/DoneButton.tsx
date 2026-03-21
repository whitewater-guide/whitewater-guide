import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';

import theme from '../../../theme';
import notifier from './notifier';

type MaybeCoordinate = CodegenCoordinates | undefined;

const DoneButton: React.FC = () => {
  const [disabled, setDisabled] = useState(true);
  const { goBack } = useNavigation();
  const { t } = useTranslation();
  const onPress = useCallback(() => goBack(), [goBack]);
  useEffect(() => {
    notifier.callback = (shape: [MaybeCoordinate, MaybeCoordinate]) => {
      setDisabled(!shape[0] || !shape[1]);
    };
    return () => {
      notifier.callback = undefined;
    };
  }, [setDisabled]);
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
};

DoneButton.displayName = 'DoneButton';

export default DoneButton;
