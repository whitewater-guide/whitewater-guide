import {
  APP_ERROR_MUTATION,
  APP_ERROR_QUERY,
  AppErrorMutationVars,
  AppErrorQueryResult,
} from '@whitewater-guide/clients';
import React from 'react';
import { Mutation, MutationFn, Query } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { Snackbar } from 'react-native-paper';
import { useNetInfo } from '../utils/useNetInfo';

export const ErrorSnackbar: React.FC = () => {
  const [t] = useTranslation();
  const isConnected = useNetInfo();
  return (
    <Query<AppErrorQueryResult> query={APP_ERROR_QUERY}>
      {({ data }) => {
        let errorStr = '';
        if (data && data.appError) {
          errorStr = t(`errors:${data.appError.type}`, {
            id: data.appError.id,
          });
        }
        const visible =
          !!data &&
          !!data.appError &&
          (data.appError.type === 'fetch' ? isConnected : true);
        return (
          <Mutation<AppErrorMutationVars> mutation={APP_ERROR_MUTATION}>
            {(setApolloError: MutationFn) => (
              <Snackbar
                visible={visible}
                duration={Snackbar.DURATION_MEDIUM}
                onDismiss={() => setApolloError({ variables: { error: null } })}
              >
                {errorStr}
              </Snackbar>
            )}
          </Mutation>
        );
      }}
    </Query>
  );
};
