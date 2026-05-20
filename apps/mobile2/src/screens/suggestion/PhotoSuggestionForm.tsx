import { Formik } from 'formik';
import { memo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { TextInput } from 'react-native';
import { ScrollView, StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { Button } from 'react-native-paper';

import CCNote from '../../components/CCNote';
import { PhotoUploadField } from '../../forms/photo-upload';
import TextField from '../../forms/TextField';
import theme from '../../theme';
import type { PhotoSuggestion } from './navigation-types';
import useKeyboard from './useKeyboard';
import usePhotoSuggestionForm from './usePhotoSuggestionForm';

const styles = StyleSheet.create({
  avoider: {
    flex: 1,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: theme.margin.single,
  },
});

interface Props {
  sectionId: string;
  localPhotoId: string;
}

function PhotoSuggestionForm({ sectionId, localPhotoId }: Props) {
  const descriptionRef = useRef<TextInput | null>(null);
  const onCopyrightSubmit = useCallback(() => {
    descriptionRef.current?.focus();
  }, []);
  const { t } = useTranslation();
  const [scroll, handlers] = useKeyboard();
  const form = usePhotoSuggestionForm(sectionId, localPhotoId);

  return (
    <Formik<PhotoSuggestion> {...form} validateOnMount>
      {({ isSubmitting, isValid, submitForm }) => (
        <KeyboardAvoidingView style={styles.avoider} behavior="padding">
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
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
}

PhotoSuggestionForm.displayName = 'PhotoSuggestionForm';

export default memo(PhotoSuggestionForm);
