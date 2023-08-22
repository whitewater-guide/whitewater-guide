import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';

import FullScreenKAV from '~/components/FullScreenKAV';
import PhotoUploadField from '~/forms/photo-upload';
import TextField from '~/forms/TextField';
import theme from '~/theme';

import useKeyboard from './useKeyboard';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    height: theme.stackScreenHeight,
    padding: theme.margin.single,
  },
});

interface Props {
  index: number;
  localPhotoId: string;
}

const SectionPhotoForm: React.FC<Props> = React.memo((props) => {
  const { index, localPhotoId } = props;
  const [scroll, handlers] = useKeyboard();
  const { t } = useTranslation();

  return (
    <FullScreenKAV>
      <ScrollView
        ref={scroll}
        style={styles.container}
        contentContainerStyle={styles.content}
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
          onFocus={handlers.onCopyrightFocus}
        />
        <TextField
          name={`media.${index}.description`}
          multiline
          fullHeight
          label={t('screens:suggestion.photoDescriptionLabel')}
          placeholder={t('screens:suggestion.photoDescriptionPlaceholder')}
          onFocus={handlers.onDescriptionFocus}
        />
      </ScrollView>
    </FullScreenKAV>
  );
});

SectionPhotoForm.displayName = 'SectionPhotoForm';

export default SectionPhotoForm;
