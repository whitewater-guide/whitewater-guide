import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { PortalProvider } from 'react-native-portal';
import { ThemeProvider } from 'glamorous-native';
import RootView from './core/RootView';
import configureStore from './core/config/configureStore';
import { apolloClient } from './core/config/configureApollo';
import theme from './theme';
import './core/config/configureOthers';

const store = configureStore();

export default function App() {
  return (
    <ApolloProvider store={store} client={apolloClient}>
      <ThemeProvider theme={theme}>
        <PortalProvider>
          <RootView />
        </PortalProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
