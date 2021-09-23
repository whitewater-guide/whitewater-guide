import { useNavigation } from '@react-navigation/native';
import { getValidationErrors } from '@whitewater-guide/clients';
import { SuggestionInput } from '@whitewater-guide/schema';
import { FormikHelpers } from 'formik';
import { useCallback } from 'react';

import showSnackbarError from '~/components/showSnackbarError';
import showSnackbarMessage from '~/components/showSnackbarMessage';

import { useAddSuggestionMutation } from './addSuggestion.generated';
import { SuggestionNavProp } from './types';

export default () => {
  const [mutate] = useAddSuggestionMutation();
  const { goBack } = useNavigation<SuggestionNavProp>();
  return useCallback(
    (suggestion: SuggestionInput, helpers: FormikHelpers<SuggestionInput>) =>
      mutate({ variables: { suggestion } })
        .then((resp) => {
          if (resp.errors) {
            showSnackbarError(resp.errors[0]);
            helpers.setErrors(getValidationErrors([...resp.errors]));
          } else {
            showSnackbarMessage('screens:suggestion.successMessage');
            goBack();
          }
        })
        .catch((error: Error) => {
          showSnackbarError(error);
        }),
    [mutate, goBack],
  );
};
