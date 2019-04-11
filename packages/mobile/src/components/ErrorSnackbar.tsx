import {
  APOLLO_ERROR_MUTATION,
  APOLLO_ERROR_QUERY,
  apolloErrorToString,
} from '@whitewater-guide/clients';
import React from 'react';
import { Mutation, MutationFn, Query } from 'react-apollo';
import { Snackbar } from 'react-native-paper';

export const ErrorSnackbar = () => (
  <Query query={APOLLO_ERROR_QUERY}>
    {({ data }: any) => (
      <Mutation mutation={APOLLO_ERROR_MUTATION}>
        {(setApolloError: MutationFn) => (
          <Snackbar
            visible={!!data.apolloError}
            onDismiss={() => setApolloError({ variables: { error: null } })}
          >
            {apolloErrorToString(data.apolloError)}
          </Snackbar>
        )}
      </Mutation>
    )}
  </Query>
);
