import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { GuidedTourProvider } from './guide';
import RootView from './core/RootView';
import configureStore from './core/config/configureStore';
import { apolloClient } from './core/config/configureApollo';
import './core/config/configureOthers';

const store = configureStore();

export default () => (
  <ApolloProvider store={store} client={apolloClient}>
    <GuidedTourProvider>
      <RootView />
    </GuidedTourProvider>
  </ApolloProvider>
);
