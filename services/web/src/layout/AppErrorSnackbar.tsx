import {
  APP_ERROR_MUTATION,
  APP_ERROR_QUERY,
  AppErrorMutationVars,
  AppErrorQueryResult,
} from '@whitewater-guide/clients';
import Snackbar from 'material-ui/Snackbar';
import React from 'react';
import { Mutation, Query } from 'react-apollo';
import CopyToClipboard from 'react-copy-to-clipboard';

const AppErrorSnackbar = () => (
  <Query<AppErrorQueryResult> query={APP_ERROR_QUERY}>
    {({ data }) => {
      const error = (data && data.appError) || undefined;
      const errorMessage = error ? `${error.message} (${error.id})` : '';
      const action = (
        <CopyToClipboard text={JSON.stringify(error, null, 2)}>
          <span>copy</span>
        </CopyToClipboard>
      );
      return (
        <Mutation<any, AppErrorMutationVars> mutation={APP_ERROR_MUTATION}>
          {(setAppError) => {
            return (
              <Snackbar
                action={action}
                open={!!error}
                message={errorMessage}
                onRequestClose={() =>
                  setAppError({ variables: { error: null } })
                }
                autoHideDuration={0}
              />
            );
          }}
        </Mutation>
      );
    }}
  </Query>
);

export default AppErrorSnackbar;
