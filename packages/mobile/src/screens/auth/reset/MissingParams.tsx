import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';

import Spacer from '~/components/Spacer';
import HelperText from '~/forms/HelperText';

import type { AuthResetNavProp } from './types';

const MissingParams: React.FC = () => {
  const { t } = useTranslation();
  const { goBack } = useNavigation<AuthResetNavProp>();
  const back = useCallback(() => goBack(), [goBack]);
  return (
    <>
      <HelperText noPad touched error="screens:auth.reset.missingParams" />
      <Spacer />
      <Button mode="contained" onPress={back}>
        {t('screens:auth.reset.goBack')}
      </Button>
    </>
  );
};

export default MissingParams;
