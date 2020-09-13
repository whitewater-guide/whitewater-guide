import { AuthResponse } from '@whitewater-guide/clients';
import { FormikConfig, FormikHelpers } from 'formik';
import mapValues from 'lodash/mapValues';
import { useCallback, useState } from 'react';

type ApiCall<Values> = (v: Values) => Promise<AuthResponse>;
type SuccessCallback = (resp: AuthResponse<any>) => void;

export type UseAuthSubmit<Values> = [FormikConfig<Values>['onSubmit'], boolean];

export const useAuthSubmit = <Values>(
  errorPrefix: string,
  apiCall: ApiCall<Values>,
  onSuccess?: SuccessCallback,
): UseAuthSubmit<Values> => {
  const [isSuccessful, setIsSuccessful] = useState(false);

  const submit = useCallback(
    (values: Values, actions: FormikHelpers<Values>) => {
      setIsSuccessful(false);
      return apiCall(values)
        .then((resp) => {
          const { success, error } = resp;
          if (success) {
            setIsSuccessful(true);
            if (onSuccess) {
              onSuccess(resp);
            }
          } else {
            if (error) {
              actions.setErrors(
                mapValues(error, (v, k) => `${errorPrefix}${k}.${v}`) as any,
              );
            }
          }
        })
        .catch(() => {
          actions.setErrors({ form: `${errorPrefix}form.fetch_error` } as any);
        })
        .finally(() => {
          actions.setSubmitting(false);
        });
    },
    [apiCall, errorPrefix, onSuccess, setIsSuccessful],
  );

  return [submit, isSuccessful];
};
