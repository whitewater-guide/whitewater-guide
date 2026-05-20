import type { SuggestionInput } from '@whitewater-guide/schema';
import { SuggestionInputSchema } from '@whitewater-guide/schema';
import { Formik } from 'formik';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { Button } from 'react-native-paper';

import CCNote from '../../components/CCNote';
import TextField from '../../forms/TextField';
import useValidate from '../../forms/useValidate';
import theme from '../../theme';
import getInitialValues from './getInitialValues';
import useAddSuggestion from './useAddSuggestion';

const styles = StyleSheet.create({
  avoider: {
    flex: 1,
  },
  container: {
    padding: theme.margin.single,
  },
  helperText: {
    marginTop: theme.margin.half,
  },
});

interface Props {
  sectionId: string;
}

function SimpleSuggestionForm({ sectionId }: Props) {
  const { t } = useTranslation();
  const initialValues = useMemo(() => getInitialValues(sectionId), [sectionId]);
  const onSubmit = useAddSuggestion();
  const validate = useValidate(SuggestionInputSchema);

  return (
    <KeyboardAvoidingView style={styles.avoider} behavior="padding">
      <Formik<SuggestionInput>
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}
      >
        {({ submitForm, isSubmitting }) => (
          <ScrollView contentContainerStyle={styles.container}>
            <TextField
              name="description"
              autoFocus={Platform.OS === 'android'}
              multiline
              label={t('screens:suggestion.suggestionLabel')}
              placeholder={t('screens:suggestion.suggestionPlaceholder')}
              helperTextStyle={styles.helperText}
            />
            <CCNote />
            <Button
              mode="contained"
              onPress={isSubmitting ? undefined : submitForm}
              loading={isSubmitting}
            >
              {t('screens:suggestion.submitSimple')}
            </Button>
          </ScrollView>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
}

SimpleSuggestionForm.displayName = 'SimpleSuggestionForm';

export default SimpleSuggestionForm;
