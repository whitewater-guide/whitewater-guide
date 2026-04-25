import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from 'react-native-keyboard-controller';

import { PhotoUploadField } from '../../../forms/photo-upload';
import TextField from '../../../forms/TextField';
import theme from '../../../theme';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
});

interface Props {
  index: number;
  localPhotoId: string;
}

function SectionPhotoForm({ index, localPhotoId }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        bottomOffset={35}
        keyboardShouldPersistTaps="always"
      >
        <PhotoUploadField
          name={`media.${index}.photo`}
          localPhotoId={localPhotoId}
          testID="photo-picker"
        />
        <TextField
          name={`media.${index}.copyright`}
          label={t('screens:suggestion.copyrightLabel')}
          placeholder={t('screens:suggestion.copyrightPlaceholder')}
          returnKeyType="next"
          blurOnSubmit={false}
        />
        <TextField
          name={`media.${index}.description`}
          multiline
          label={t('screens:suggestion.photoDescriptionLabel')}
          placeholder={t('screens:suggestion.photoDescriptionPlaceholder')}
        />
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </>
  );
}

export default memo(SectionPhotoForm);
