import { useNavigation } from '@react-navigation/native';
import { getValidationErrors } from '@whitewater-guide/clients';
import { SuggestionInput } from '@whitewater-guide/schema';
import { FormikHelpers } from 'formik';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useSnackbarMessage } from '~/components/snackbar';

import { useAddSuggestionMutation } from './addSuggestion.generated';
import { SuggestionNavProp } from './types';

export default () => {
  const { t } = useTranslation();
  const [mutate] = useAddSuggestionMutation();
  const { goBack } = useNavigation<SuggestionNavProp>();
  const setSnackbar = useSnackbarMessage();
  return useCallback(
    (suggestion: SuggestionInput, helpers: FormikHelpers<SuggestionInput>) =>
      mutate({ variables: { suggestion } })
        .then((resp) => {
          if (resp.errors) {
            setSnackbar(resp.errors[0]);
            helpers.setErrors(getValidationErrors(resp.errors));
          } else {
            setSnackbar({ short: t('screens:suggestion.successMessage') });
            goBack();
          }
        })
        .catch((error: Error) => {
          setSnackbar(error);
        }),
    [mutate, goBack, setSnackbar, t],
  );
};
