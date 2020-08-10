import { useNavigation } from '@react-navigation/native';
import { getValidationErrors } from '@whitewater-guide/clients';
import { SectionInput } from '@whitewater-guide/commons';
import { FormikHelpers } from 'formik';
import gql from 'graphql-tag';
import { useCallback } from 'react';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useSnackbarMessage } from '~/components/snackbar';
import formToInput from './formToInput';
import { SectionFormInput } from './types';

const ADD_SECTION_MUTATION = gql`
  mutation addSection($section: SectionInput!) {
    upsertSection(section: $section) {
      id
    }
  }
`;

interface MVars {
  section: SectionInput;
}

export default () => {
  const { t } = useTranslation();
  const [mutate] = useMutation<any, MVars>(ADD_SECTION_MUTATION);
  const { goBack } = useNavigation();
  const setSnackbar = useSnackbarMessage();
  return useCallback(
    (section: SectionFormInput, helpers: FormikHelpers<SectionFormInput>) =>
      mutate({ variables: { section: formToInput(section) } })
        .then((resp) => {
          if (resp.errors) {
            setSnackbar(resp.errors[0]);
            helpers.setErrors(getValidationErrors(resp.errors));
          } else {
            setSnackbar({ short: t('screens:addSection.successMessage') });
            goBack();
          }
        })
        .catch((error: Error) => {
          setSnackbar(error);
        }),
    [mutate, goBack, setSnackbar, t],
  );
};
