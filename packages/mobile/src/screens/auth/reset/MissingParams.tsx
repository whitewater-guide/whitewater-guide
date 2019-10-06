import Spacer from 'components/Spacer';
import HelperText from 'forms/HelperText';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { useNavigation } from 'react-navigation-hooks';

const MissingParams: React.FC = () => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const back = useCallback(() => goBack(), [goBack]);
  return (
    <React.Fragment>
      <HelperText
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
