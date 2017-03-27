import React from 'react';
import { ApolloProvider } from 'react-apollo';
import RootView from './core/RootView';
import configureStore from './core/config/configureStore';
import { apolloClient } from './core/config/configureApollo';

const store = configureStore();

export default function App() {
  return (
    <ApolloProvider store={store} client={apolloClient}>
      <RootView />
    </ApolloProvider>
  );
}
