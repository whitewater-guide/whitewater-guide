import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhotoUploadField from '~/forms/photo-upload';
import TextField from '~/forms/TextField';
import theme from '~/theme';

const styles = StyleSheet.create({
  description: {
    flex: 1,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    padding: theme.margin.single,
  },
});

interface Props {
  index: number;
  localPhotoId: string;
}

const SectionPhotoForm: React.FC<Props> = React.memo((props) => {
  const { index, localPhotoId } = props;
  const { t } = useTranslation();

  return (
    <KeyboardAwareScrollView
      style={StyleSheet.absoluteFill}
      contentContainerStyle={styles.content}
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
        multiline={true}
        wrapperStyle={styles.description}
        style={styles.description}
        label={t('screens:suggestion.photoDescriptionLabel')}
        placeholder={t('screens:suggestion.photoDescriptionPlaceholder')}
      />
    </KeyboardAwareScrollView>
  );
});

SectionPhotoForm.displayName = 'SectionPhotoForm';

export default SectionPhotoForm;
