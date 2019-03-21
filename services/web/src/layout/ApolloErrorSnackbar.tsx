import {
  APOLLO_ERROR_MUTATION,
  APOLLO_ERROR_QUERY,
  apolloErrorToString,
} from '@whitewater-guide/clients';
import Snackbar from 'material-ui/Snackbar';
import React from 'react';
import { Mutation, Query } from 'react-apollo';
import CopyToClipboard from 'react-copy-to-clipboard';

const ApolloErrorSnackbar = () => (
  <Query query={APOLLO_ERROR_QUERY}>
    {({ data }) => {
      const action = (
        <CopyToClipboard text={JSON.stringify(data.apolloError, null, 2)}>
          <span>copy</span>
        </CopyToClipboard>
      );
      return (
        <Mutation mutation={APOLLO_ERROR_MUTATION}>
          {(setApolloError) => {
            return (
              <Snackbar
                action={action}
                open={!!data.apolloError}
                message={apolloErrorToString(data.apolloError)}
                onRequestClose={() =>
                  setApolloError({ variables: { error: null } })
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

export default ApolloErrorSnackbar;
