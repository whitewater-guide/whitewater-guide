import {
  apolloErrorToString,
  APP_ERROR_MUTATION,
  APP_ERROR_QUERY,
} from '@whitewater-guide/clients';
import Snackbar from 'material-ui/Snackbar';
import React from 'react';
import { Mutation, Query } from 'react-apollo';
import CopyToClipboard from 'react-copy-to-clipboard';

const AppErrorSnackbar = () => (
  <Query query={APP_ERROR_QUERY}>
    {({ data }) => {
      const action = (
        <CopyToClipboard text={JSON.stringify(data.apolloError, null, 2)}>
          <span>copy</span>
        </CopyToClipboard>
      );
      return (
        <Mutation mutation={APP_ERROR_MUTATION}>
          {(setAppError) => {
            return (
              <Snackbar
                action={action}
                open={!!data.apolloError}
                message={apolloErrorToString(data.apolloError)}
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
