import {
  SuggestionInput,
  SuggestionInputSchema,
} from '@whitewater-guide/commons';
import { Formik } from 'formik';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { TextField, useValidate } from '../../components/forms';
import theme from '../../theme';
import getInitialValues from './getInitialValues';
import TermsOfUseLink from './TermsOfUseLink';
import useAddSuggestion from './useAddSuggestion';

const styles = StyleSheet.create({
  container: {
    padding: theme.margin.single,
    flex: 1,
  },
  description: {
    flex: 1,
  },
});

interface Props {
  sectionId: string;
}

const SimpleSuggestionForm: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => getInitialValues(props.sectionId), [
    props.sectionId,
  ]);
  const onSubmit = useAddSuggestion();
  const validate = useValidate(SuggestionInputSchema);
  return (
    <KeyboardAvoidingView
      behavior="height"
      style={styles.container}
      keyboardVerticalOffset={64 + theme.safeBottom + theme.safeTop}
    >
      <Formik<SuggestionInput>
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}
      >
        {({ submitForm, isSubmitting }) => (
          <React.Fragment>
            <TextField
              name="description"
              mode="outlined"
              autoFocus={true}
              multiline={true}
              style={styles.description}
              label={t('screens:suggestion.suggestionLabel')}
              placeholder={t('screens:suggestion.suggestionPlaceholder')}
            />
            <TermsOfUseLink />
            <Button
              mode="contained"
              onPress={isSubmitting ? undefined : submitForm}
              loading={isSubmitting}
            >
              {t('screens:suggestion.submitSimple')}
            </Button>
          </React.Fragment>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

SimpleSuggestionForm.displayName = 'SimpleSuggestionForm';

export default SimpleSuggestionForm;
