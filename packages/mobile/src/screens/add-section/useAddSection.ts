import { useNavigation } from '@react-navigation/native';
import { getValidationErrors } from '@whitewater-guide/clients';
import type { FormikHelpers } from 'formik';
import { useCallback } from 'react';

import showSnackbarError from '~/components/showSnackbarError';
import showSnackbarMessage from '~/components/showSnackbarMessage';
import { resetToDescentForm } from '~/screens/add-section/resetToDescentForm';

import { useAddSectionMutation } from './addSection.generated';
import formToInput from './formToInput';
import type { SectionFormInput } from './types';

export default function useAddSection(fromDescentFormKey?: string) {
  const [mutate] = useAddSectionMutation();
  const navigation = useNavigation();

  return useCallback(
    (section: SectionFormInput, helpers: FormikHelpers<SectionFormInput>) =>
      mutate({ variables: { section: formToInput(section) } })
        .then((resp) => {
          if (resp.errors) {
            showSnackbarError(resp.errors[0]);
            helpers.setErrors(getValidationErrors([...resp.errors]));
          } else {
            showSnackbarMessage('screens:addSection.successMessage');
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
          showSnackbarError(error);
        }),
    [mutate, navigation, fromDescentFormKey],
  );
}
