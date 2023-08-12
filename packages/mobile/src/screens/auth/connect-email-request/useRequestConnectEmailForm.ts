import { useNavigation } from '@react-navigation/native';
import { FormikHelpers } from 'formik';
import mapValues from 'lodash/mapValues';
import { useCallback } from 'react';

import { Screens } from '~/core/navigation';

import {
  RequestConnectEmailMutationVariables,
  useRequestConnectEmailMutation,
} from './requestConnectEmail.generated';
import { ConnectEmailRequestNavProp } from './types';

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
            actions.setErrors(
              mapValues(
                errors,
                (v, k) => `screens:connectEmailRequest.${k}.${v}`,
              ) as any,
            );
          } else {
            replace(Screens.CONNECT_EMAIL, { email: values.email });
          }
        })
        .catch(() => {
          actions.setErrors({
            form: `screens:connectEmailRequest.form.fetch_error`,
          } as any);
        })
        .finally(() => {
          actions.setSubmitting(false);
        });
    },
    [mutate, replace],
  );

  return submit;
}
