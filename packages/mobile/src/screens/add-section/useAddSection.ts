import { useNavigation } from '@react-navigation/native';
import { getValidationErrors } from '@whitewater-guide/clients';
import { FormikHelpers } from 'formik';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useSnackbarMessage } from '~/components/snackbar';
import { resetToDescentForm } from '~/screens/add-section/resetToDescentForm';

import { useAddSectionMutation } from './addSection.generated';
import formToInput from './formToInput';
import { SectionFormInput } from './types';

export default (fromDescentFormKey?: string) => {
  const { t } = useTranslation();
  const [mutate] = useAddSectionMutation();
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
              navigation.dispatch((state) =>
                resetToDescentForm(state, resp.data?.upsertSection),
              );
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
