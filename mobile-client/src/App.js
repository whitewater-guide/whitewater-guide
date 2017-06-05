import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { StyleProvider } from 'native-base';
import { PortalProvider } from 'react-native-portal';
import RootView from './core/RootView';
import configureStore from './core/config/configureStore';
import { apolloClient } from './core/config/configureApollo';
import getTheme from './theme/components';
import platform from './theme/variables/platform';
import './core/config/configureOthers';

const store = configureStore();

export default function App() {
  return (
    <ApolloProvider store={store} client={apolloClient}>
      <StyleProvider style={getTheme(platform)}>
        <PortalProvider>
          <RootView />
        </PortalProvider>
      </StyleProvider>
    </ApolloProvider>
  );
}
