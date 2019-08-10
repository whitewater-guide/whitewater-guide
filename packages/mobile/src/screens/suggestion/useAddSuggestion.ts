import { SuggestionInput } from '@whitewater-guide/commons';
import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import gql from 'graphql-tag';
import { useCallback } from 'react';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useSnackbarMessage } from '../../components/snackbar';

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
  const { goBack } = useNavigation();
  const setSnackbar = useSnackbarMessage();
  return useCallback(
    (suggestion: SuggestionInput) =>
      mutate({ variables: { suggestion } }).then(() => {
        goBack();
        setSnackbar({ short: t('screens:suggestion.successMessage') });
      }),
    [mutate, goBack, setSnackbar, t],
  );
};
