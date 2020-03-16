import { LocalPhotoStatus } from '@whitewater-guide/clients';
import { SectionInput } from '@whitewater-guide/commons';
import { getIn, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { LocalPhoto } from '../../../../features/uploads';
import theme from '../../../../theme';

interface Props {
  index: number;
  onPress: () => void;
}

const BackButton: React.FC<Props> = React.memo(({ index, onPress }) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<SectionInput>();
  const value: LocalPhoto | undefined = getIn(values, `media.${index}.photo`);
  const isBusy = value && value.status !== LocalPhotoStatus.READY;

  return (
    <Button
      color={theme.colors.textLight}
      onPress={onPress}
      disabled={isBusy}
      accessibilityLabel={t('commons:done')}
      testID="add-section-photo-done-btn"
    >
      {t('commons:done')}
    </Button>
  );
});

BackButton.displayName = 'BackButton';

export default BackButton;
