import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import { apolloClient } from './apollo';
import { RootLayout } from './layout';
import { configureStore } from './store';
import { theme } from './styles';

const store = configureStore();

export default () => (
  <MuiThemeProvider muiTheme={theme}>
    <ApolloProvider store={store} client={apolloClient}>
      <BrowserRouter>
        <RootLayout />
      </BrowserRouter>
    </ApolloProvider>
  </MuiThemeProvider>
);
