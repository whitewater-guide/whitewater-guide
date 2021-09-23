import { useNavigation } from '@react-navigation/native';
import { getValidationErrors } from '@whitewater-guide/clients';
import { omitTypename } from '@whitewater-guide/commons';
import { FormikHelpers } from 'formik';
import isNil from 'lodash/isNil';
import { useCallback } from 'react';

import showSnackbarError from '~/components/showSnackbarError';
import showSnackbarMessage from '~/components/showSnackbarMessage';

import { DescentFormData } from './types';
import { useUpsertDescentMutation } from './upsertDescent.generated';

export default () => {
  const [mutate] = useUpsertDescentMutation();
  const { goBack } = useNavigation();
  return useCallback(
    (
      { section, level, ...data }: DescentFormData,
      helpers: FormikHelpers<DescentFormData>,
    ) =>
      mutate({
        variables: {
          descent: {
            ...omitTypename(data),
            level: isNil(level?.value) ? null : level,
            sectionId: section.id,
          },
        },
        refetchQueries: ['listMyDescents'],
      })
        .then((resp) => {
          if (resp.errors) {
            showSnackbarError(resp.errors[0]);
            helpers.setErrors(getValidationErrors([...resp.errors]));
          } else {
            showSnackbarMessage(
              data.id
                ? 'screens:descentForm.updateSuccessMessage'
                : 'screens:descentForm.createSuccessMessage',
            );
            goBack();
          }
        })
        .catch(() => {
          showSnackbarError('common:networkError');
        }),
    [mutate, goBack],
  );
};
