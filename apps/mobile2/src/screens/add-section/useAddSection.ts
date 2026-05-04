import { useNavigation } from '@react-navigation/native';
import { getValidationErrors } from '@whitewater-guide/clients';
import type { FormikHelpers } from 'formik';
import type { GraphQLError } from 'graphql';
import { useCallback } from 'react';

import { showSnackbar, showSnackbarError } from '../../components/snackbar';
import { useAddSectionMutation } from './addSection.generated';
import { useAddSectionDraft } from './AddSectionDraftContext';
import formToInput from './formToInput';
import type { AddSectionTabsScreenProps } from './navigation-types';
import { resetToDescentForm } from './resetToDescentForm';
import type { SectionFormInput } from './types';

export default function useAddSection(fromDescentFormKey?: string) {
  const [mutate] = useAddSectionMutation();
  const navigation = useNavigation<AddSectionTabsScreenProps['navigation']>();
  const { resetDraft } = useAddSectionDraft();

  return useCallback(
    async (
      section: SectionFormInput,
      helpers: FormikHelpers<SectionFormInput>,
    ) => {
      try {
        const resp = await mutate({
          variables: { section: formToInput(section) },
        });
        if (resp.errors?.length) {
          showSnackbarError(resp.errors[0].message);
          helpers.setErrors(
            getValidationErrors([...resp.errors] as unknown as GraphQLError[]),
          );
          return;
        }
        showSnackbar('screens:addSection.successMessage');
        resetDraft();
        if (fromDescentFormKey) {
          navigation.dispatch((state) =>
            resetToDescentForm(state, resp.data?.upsertSection),
          );
        } else {
          navigation.goBack();
        }
      } catch (error) {
        showSnackbarError(error as Error);
      }
    },
    [mutate, navigation, fromDescentFormKey, resetDraft],
  );
}
