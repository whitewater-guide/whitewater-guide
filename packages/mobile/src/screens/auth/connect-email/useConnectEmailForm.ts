import { useNavigation } from '@react-navigation/native';
import { FormikHelpers } from 'formik';
import mapValues from 'lodash/mapValues';
import { useCallback } from 'react';

import { Screens } from '~/core/navigation';

import {
  ConnectEmailMutationVariables,
  useConnectEmailMutation,
} from './connectEmail.generated';
import { ConnectEmailNavProp } from './types';

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
            actions.setErrors(
              mapValues(
                errors,
                (v, k) => `screens:connectEmail.${k}.${v}`,
              ) as any,
            );
          } else {
            replace(Screens.CONNECT_EMAIL_SUCCESS);
          }
        })
        .catch(() => {
          actions.setErrors({
            form: `screens:connectEmail.form.fetch_error`,
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
