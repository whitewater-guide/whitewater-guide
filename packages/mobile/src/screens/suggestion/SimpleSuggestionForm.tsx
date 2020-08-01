import {
  SuggestionInput,
  SuggestionInputSchema,
} from '@whitewater-guide/commons';
import { Formik } from 'formik';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import CCNote from '~/components/CCNote';
import FullScreenKAV from '~/components/FullScreenKAV';
import TextField from '~/forms/TextField';
import useValidate from '~/forms/useValidate';
import theme from '~/theme';
import getInitialValues from './getInitialValues';
import useAddSuggestion from './useAddSuggestion';

const styles = StyleSheet.create({
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

const SimpleSuggestionForm: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => getInitialValues(props.sectionId), [
    props.sectionId,
  ]);
  const onSubmit = useAddSuggestion();
  const validate = useValidate(SuggestionInputSchema);
  return (
    <FullScreenKAV contentStyle={styles.container}>
      <Formik<SuggestionInput>
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}
      >
        {({ submitForm, isSubmitting }) => (
          <React.Fragment>
            <TextField
              name="description"
              autoFocus={true}
              multiline={true}
              fullHeight={true}
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
          </React.Fragment>
        )}
      </Formik>
    </FullScreenKAV>
  );
};

SimpleSuggestionForm.displayName = 'SimpleSuggestionForm';

export default SimpleSuggestionForm;
