import Snackbar from '@material-ui/core/Snackbar';
import {
  APP_ERROR_MUTATION,
  APP_ERROR_QUERY,
  AppErrorMutationVars,
  AppErrorQueryResult,
} from '@whitewater-guide/clients';
import React from 'react';
import { Mutation, Query } from 'react-apollo';

import { Clipboard } from '../components';

const AppErrorSnackbar = () => (
  <Query<AppErrorQueryResult> query={APP_ERROR_QUERY}>
    {({ data }) => {
      const error = data?.appError || undefined;
      const errorMessage = error ? `${error.message} (${error.id})` : '';
      return (
        <Mutation<unknown, AppErrorMutationVars> mutation={APP_ERROR_MUTATION}>
          {(setAppError) => (
            <Snackbar
              open={!!error}
              autoHideDuration={6000}
              onClose={() => setAppError({ variables: { error: null } })}
              message={<span>{errorMessage}</span>}
              action={<Clipboard text={JSON.stringify(error, null, 2)} />}
            />
          )}
        </Mutation>
      );
    }}
  </Query>
);

export default AppErrorSnackbar;
