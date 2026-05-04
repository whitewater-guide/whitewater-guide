import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';

import HelperText from '../../../forms/HelperText';
import type { ResetScreenProps } from './navigation-types';

function MissingParams() {
  const { t } = useTranslation();
  const { goBack } = useNavigation<ResetScreenProps['navigation']>();
  const back = useCallback(() => goBack(), [goBack]);
  return (
    <>
      <HelperText noPad touched error="screens:auth.reset.missingParams" />
      <Button mode="contained" onPress={back}>
        {t('screens:auth.reset.goBack')}
      </Button>
    </>
  );
}

export default MissingParams;
