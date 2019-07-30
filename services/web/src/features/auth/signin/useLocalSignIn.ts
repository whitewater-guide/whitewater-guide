import { Credentials, useAuth } from '@whitewater-guide/clients';
import { FormikHelpers } from 'formik';
import { useCallback } from 'react';
import useRouter from 'use-react-router';

const useLocalSignIn = (backPath?: string) => {
  const { service } = useAuth();
  const { history } = useRouter();

  return useCallback(
    (values: Credentials, actions: FormikHelpers<Credentials>) => {
      actions.setStatus({ success: false, error: null });
      return service
        .signIn('local', values)
        .then((resp) => {
          const { success, error } = resp;
          if (success) {
            if (backPath) {
              history.replace(backPath);
            } else {
              history.goBack();
            }
          } else {
            actions.setErrors(error as any);
            if (error) {
              actions.setStatus({ success: false, error });
            }
          }
        })
        .catch(() => {
          actions.setStatus({
            success: false,
            error: 'Network request failed',
          });
        })
        .finally(() => {
          actions.setSubmitting(false);
        });
    },
    [service, history, backPath],
  );
};

export default useLocalSignIn;
