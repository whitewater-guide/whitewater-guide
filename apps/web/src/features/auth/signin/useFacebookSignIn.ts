import { useAuth } from '@whitewater-guide/clients';
import { useCallback } from 'react';
import { useHistory } from 'react-router';

export default (backPath?: string) => {
  const { service } = useAuth();
  const history = useHistory();
  return useCallback(
    () =>
      service.signIn('facebook').then(({ success }) => {
        if (success) {
          if (backPath) {
            history.replace(backPath);
          } else {
            history.goBack();
          }
        }
      }),
    [service, history, backPath],
  );
};
