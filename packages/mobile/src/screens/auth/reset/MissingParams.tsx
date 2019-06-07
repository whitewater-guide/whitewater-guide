import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { Spacer } from '../../../components';
import { ErrorText } from '../../../components/forms';

const MissingParams: React.FC = () => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const back = useCallback(() => goBack(), [goBack]);
  return (
    <React.Fragment>
      <ErrorText
        noPad={true}
        touched={true}
        error="screens:auth.reset.missingParams"
      />
      <Spacer />
      <Button mode="contained" onPress={back}>
        {t('screens:auth.reset.goBack')}
      </Button>
    </React.Fragment>
  );
};

export default MissingParams;
