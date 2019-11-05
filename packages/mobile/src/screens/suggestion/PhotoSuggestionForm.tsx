import CCNote from 'components/CCNote';
import { Formik } from 'formik';
import PhotoUploadField from 'forms/photo-upload';
import TextField from 'forms/TextField';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Button } from 'react-native-paper';
import theme from '../../theme';
import { PhotoSuggestion } from './types';
import useKeyboard from './useKeyboard';
import usePhotoSuggestionForm from './usePhotoSuggestionForm';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  containerContent: {
    height: theme.stackScreenHeight,
  },
  content: {
    height: theme.stackScreenHeight,
    padding: theme.margin.single,
  },
  description: {
    flex: 1,
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
    <Formik<PhotoSuggestion> {...form} validateOnMount={true}>
      {({ isSubmitting, isValid, submitForm }) => (
        <KeyboardAvoidingView
          behavior="height"
          style={styles.container}
          keyboardVerticalOffset={75 + theme.safeBottom}
        >
          <ScrollView
            ref={scroll}
            style={styles.container}
            contentContainerStyle={styles.content}
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
              multiline={true}
              wrapperStyle={styles.description}
              style={styles.description}
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
});

PhotoSuggestionForm.displayName = 'PhotoSuggestionForm';

export default PhotoSuggestionForm;
