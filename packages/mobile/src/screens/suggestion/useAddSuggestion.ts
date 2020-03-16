import { useNavigation } from '@react-navigation/native';
import { getValidationErrors } from '@whitewater-guide/clients';
import { SuggestionInput } from '@whitewater-guide/commons';
import { FormikHelpers } from 'formik';
import gql from 'graphql-tag';
import { useCallback } from 'react';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useSnackbarMessage } from '~/components/snackbar';
import { SuggestionNavProp } from './types';

const ADD_SUGGESTION_MUTATION = gql`
  mutation addSuggestion($suggestion: SuggestionInput!) {
    addSuggestion(suggestion: $suggestion) {
      id
    }
  }
`;

interface MVars {
  suggestion: SuggestionInput;
}

export default () => {
  const { t } = useTranslation();
  const [mutate] = useMutation<any, MVars>(ADD_SUGGESTION_MUTATION);
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
