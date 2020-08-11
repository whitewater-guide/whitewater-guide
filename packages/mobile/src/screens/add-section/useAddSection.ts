import { useNavigation } from '@react-navigation/native';
import { getValidationErrors } from '@whitewater-guide/clients';
import { Section, SectionInput } from '@whitewater-guide/commons';
import { FormikHelpers } from 'formik';
import gql from 'graphql-tag';
import { useCallback } from 'react';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useSnackbarMessage } from '~/components/snackbar';
import { resetToDescentForm } from '~/screens/add-section/resetToDescentForm';
import formToInput from './formToInput';
import { SectionFormInput } from './types';

const ADD_SECTION_MUTATION = gql`
  mutation addSection($section: SectionInput!) {
    upsertSection(section: $section) {
      id
      name
      river {
        id
        name
      }
    }
  }
`;

interface MVars {
  section: SectionInput;
}

interface MResult {
  upsertSection: Section;
}

export default (fromDescentFormKey?: string) => {
  const { t } = useTranslation();
  const [mutate] = useMutation<MResult, MVars>(ADD_SECTION_MUTATION);
  const navigation = useNavigation();
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
            if (fromDescentFormKey) {
              navigation.dispatch((state) => {
                return resetToDescentForm(state, resp.data?.upsertSection);
              });
            } else {
              navigation.goBack();
            }
          }
        })
        .catch((error: Error) => {
          setSnackbar(error);
        }),
    [mutate, navigation, setSnackbar, fromDescentFormKey, t],
  );
};
