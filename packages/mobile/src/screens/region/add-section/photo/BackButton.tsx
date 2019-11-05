import { LocalPhotoStatus } from '@whitewater-guide/clients';
import { SectionInput } from '@whitewater-guide/commons';
import { getIn, useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { useNavigation } from 'react-navigation-hooks';
import { LocalPhoto } from '../../../../features/uploads';
import theme from '../../../../theme';

const BackButton: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { goBack, getParam } = useNavigation();
  const index = getParam('index');
  const { values } = useFormikContext<SectionInput>();
  const value: LocalPhoto | undefined = getIn(values, `media.${index}.photo`);
  const isBusy = value && value.status !== LocalPhotoStatus.READY;

  const onPress = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <Button
      color={theme.colors.textLight}
      onPress={onPress}
      disabled={isBusy}
      accessibilityLabel={t('commons:done')}
    >
      {t('commons:done')}
    </Button>
  );
});

BackButton.displayName = 'BackButton';

export default BackButton;
