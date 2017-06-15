import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { PortalProvider } from 'react-native-portal';
import RootView from './core/RootView';
import configureStore from './core/config/configureStore';
import { apolloClient } from './core/config/configureApollo';
import './core/config/configureOthers';

const store = configureStore();

export default function App() {
  return (
    <ApolloProvider store={store} client={apolloClient}>
      <PortalProvider>
        <RootView />
      </PortalProvider>
    </ApolloProvider>
  );
}
