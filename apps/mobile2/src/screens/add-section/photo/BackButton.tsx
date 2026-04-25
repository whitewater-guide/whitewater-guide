import { LocalPhotoStatus } from '@whitewater-guide/clients';
import { getIn, useFormikContext } from 'formik';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';

import type { LocalPhoto } from '../../../features/uploads';
import theme from '../../../theme';
import type { MediaFormInput } from '../types';

interface Props {
  index: number;
  onPress: () => void;
}

function BackButton({ index, onPress }: Props) {
  const { t } = useTranslation();
  const { values } = useFormikContext<{ media: MediaFormInput[] }>();
  const value: LocalPhoto | undefined = getIn(values, `media.${index}.photo`);
  const isBusy = value && value.status !== LocalPhotoStatus.READY;

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
