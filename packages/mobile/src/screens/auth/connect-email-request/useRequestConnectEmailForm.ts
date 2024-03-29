import { useNavigation } from '@react-navigation/native';
import type { FormikHelpers } from 'formik';
import { useCallback } from 'react';

import { Screens } from '~/core/navigation';

import getFormErrors from '../getFormErrors';
import type { RequestConnectEmailMutationVariables } from './requestConnectEmail.generated';
import { useRequestConnectEmailMutation } from './requestConnectEmail.generated';
import type { ConnectEmailRequestNavProp } from './types';

export default function useRequestConnectEmailForm() {
  const { replace } = useNavigation<ConnectEmailRequestNavProp>();
  const [mutate] = useRequestConnectEmailMutation();

  const submit = useCallback(
    (
      values: RequestConnectEmailMutationVariables,
      actions: FormikHelpers<RequestConnectEmailMutationVariables>,
    ) => {
      return mutate({ variables: values })
        .then((resp) => {
          const { errors } = resp;
          if (errors) {
            actions.setErrors(getFormErrors(errors));
          } else {
            replace(Screens.CONNECT_EMAIL, { email: values.email });
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
