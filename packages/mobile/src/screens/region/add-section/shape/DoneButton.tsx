import { Coordinate3d } from '@whitewater-guide/commons';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { useNavigation } from 'react-navigation-hooks';
import theme from '../../../../theme';
import notifier from './notifier';

type Maybe3d = Coordinate3d | undefined;

const DoneButton: React.FC = () => {
  const [disabled, setDisabled] = useState(true);
  const { goBack } = useNavigation();
  const { t } = useTranslation();
  const onPress = useCallback(() => goBack(), [goBack]);
  useEffect(() => {
    notifier.callback = (shape: [Maybe3d, Maybe3d]) => {
      setDisabled(!shape[0] || !shape[1]);
    };
    return () => {
      notifier.callback = undefined;
    };
  }, [setDisabled]);
  return (
    <Button
      color={theme.colors.textLight}
      disabled={disabled}
      onPress={onPress}
      accessibilityLabel={t('commons:done')}
    >
      {t('commons:done')}
    </Button>
  );
};

DoneButton.displayName = 'DoneButton';

export default DoneButton;
