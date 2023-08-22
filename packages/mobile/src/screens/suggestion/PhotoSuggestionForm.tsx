import { Formik } from 'formik';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native-paper';

import CCNote from '~/components/CCNote';
import FullScreenKAV from '~/components/FullScreenKAV';
import PhotoUploadField from '~/forms/photo-upload';
import TextField from '~/forms/TextField';

import theme from '../../theme';
import { PhotoSuggestion } from './types';
import useKeyboard from './useKeyboard';
import usePhotoSuggestionForm from './usePhotoSuggestionForm';

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
  sectionId: string;
  localPhotoId: string;
}

const PhotoSuggestionForm: React.FC<Props> = React.memo((props) => {
  const { sectionId, localPhotoId } = props;
  const descriptionRef = useRef<TextInput | null>(null);
  const onCopyrightSubmit = useCallback(() => {
    if (descriptionRef.current) {
      descriptionRef.current.focus();
    }
  }, [descriptionRef]);
  const { t } = useTranslation();
  const [scroll, handlers] = useKeyboard();
  const form = usePhotoSuggestionForm(sectionId, localPhotoId);

  return (
    <Formik<PhotoSuggestion> {...form} validateOnMount>
      {({ isSubmitting, isValid, submitForm }) => (
        <FullScreenKAV>
          <ScrollView
            ref={scroll}
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="always"
          >
            <PhotoUploadField name="photo" localPhotoId={localPhotoId} />
            <TextField
              name="copyright"
              label={t('screens:suggestion.copyrightLabel')}
              placeholder={t('screens:suggestion.copyrightPlaceholder')}
              onFocus={handlers.onCopyrightFocus}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={onCopyrightSubmit}
            />
            <TextField
              name="description"
              ref={descriptionRef}
              multiline
              fullHeight
              label={t('screens:suggestion.photoDescriptionLabel')}
              placeholder={t('screens:suggestion.photoDescriptionPlaceholder')}
              onFocus={handlers.onDescriptionFocus}
            />
            <CCNote />
            <Button
              mode="contained"
              onPress={isSubmitting ? undefined : submitForm}
              loading={isSubmitting}
              disabled={!isValid}
            >
              {t('screens:suggestion.submitPhoto')}
            </Button>
          </ScrollView>
        </FullScreenKAV>
      )}
    </Formik>
  );
});

PhotoSuggestionForm.displayName = 'PhotoSuggestionForm';

export default PhotoSuggestionForm;
