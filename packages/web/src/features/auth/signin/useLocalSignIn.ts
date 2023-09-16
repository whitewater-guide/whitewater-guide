import type { Credentials } from '@whitewater-guide/clients';
import { useAuth } from '@whitewater-guide/clients';
import type { FormikHelpers } from 'formik';
import { useCallback } from 'react';
import { useHistory } from 'react-router';

const useLocalSignIn = (backPath?: string) => {
  const { service } = useAuth();
  const history = useHistory();

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
