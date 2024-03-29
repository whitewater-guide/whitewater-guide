import { useNavigation } from '@react-navigation/native';
import type { FormikHelpers } from 'formik';
import { useCallback } from 'react';

import { Screens } from '~/core/navigation';
import getFormErrors from '~/screens/auth/getFormErrors';

import type { ConnectEmailMutationVariables } from './connectEmail.generated';
import { useConnectEmailMutation } from './connectEmail.generated';
import type { ConnectEmailNavProp } from './types';

export default function useConnectEmailForm() {
  const { replace } = useNavigation<ConnectEmailNavProp>();
  const [mutate] = useConnectEmailMutation();

  const submit = useCallback(
    (
      values: ConnectEmailMutationVariables,
      actions: FormikHelpers<ConnectEmailMutationVariables>,
    ) => {
      return mutate({ variables: values })
        .then((resp) => {
          const { errors } = resp;
          if (errors) {
            actions.setErrors(getFormErrors(errors));
          } else {
            replace(Screens.CONNECT_EMAIL_SUCCESS);
          }
        })
        .catch(() => {
          actions.setErrors({ form: `commons:networkError` } as any);
        })
        .finally(() => {
          actions.setSubmitting(false);
        });
    },
    [mutate, replace],
  );

  return submit;
}
