import {
  SuggestionInput,
  SuggestionInputSchema,
} from '@whitewater-guide/commons';
import { Formik } from 'formik';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from 'react-native-paper';
import { Loading } from '../../components';
import {
  PhotoUploadField,
  TextField,
  useValidate,
} from '../../components/forms';
import theme from '../../theme';
import getInitialValues from './getInitialValues';
import TermsOfUseLink from './TermsOfUseLink';
import useAddSuggestion from './useAddSuggestion';
import useUploadLink from './useUploadLink';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
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
}

const PhotoSuggestionForm: React.FC<Props> = React.memo((props) => {
  const scroll = useRef<any>();
  const setScroll = useCallback((ref: any) => (scroll.current = ref), [scroll]);
  const { sectionId } = props;
  const { t } = useTranslation();
  const initialValues = useMemo(() => getInitialValues(sectionId), [sectionId]);
  const onSubmit = useAddSuggestion();
  const validate = useValidate(SuggestionInputSchema);
  const onMultilineFocus = useCallback(() => {
    if (scroll.current) {
      setTimeout(() => {
        scroll.current.props.scrollToEnd();
      }, 250);
    }
  }, [scroll]);
  const onMultilineBlur = useCallback(() => {
    if (Platform.OS === 'android' && scroll.current) {
      scroll.current.props.scrollToPosition(0, 0, true);
    }
  }, [scroll]);

  const [uploadLink, preparingLink] = useUploadLink();
  if (preparingLink || !uploadLink) {
    return <Loading />;
  }

  return (
    <Formik<SuggestionInput>
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
    >
      {({ isSubmitting, submitForm }) => (
        <KeyboardAwareScrollView
          innerRef={setScroll}
          style={styles.container}
          extraHeight={0}
          contentContainerStyle={{ height: theme.stackScreenHeight }}
        >
          <View style={styles.content}>
            <PhotoUploadField name="filename" uploadLink={uploadLink} />
            <TextField
              name="copyright"
              label={t('screens:suggestion.copyrightLabel')}
              placeholder={t('screens:suggestion.copyrightPlaceholder')}
            />
            <TextField
              name="description"
              multiline={true}
              style={styles.description}
              label={t('screens:suggestion.photoDescriptionLabel')}
              placeholder={t('screens:suggestion.photoDescriptionPlaceholder')}
              onFocus={onMultilineFocus}
              onBlur={onMultilineBlur}
            />
            <TermsOfUseLink />
            <Button
              mode="contained"
              onPress={isSubmitting ? undefined : submitForm}
              loading={isSubmitting}
            >
              {t('screens:suggestion.submitPhoto')}
            </Button>
          </View>
        </KeyboardAwareScrollView>
      )}
    </Formik>
  );
});

PhotoSuggestionForm.displayName = 'PhotoSuggestionForm';

export default PhotoSuggestionForm;
