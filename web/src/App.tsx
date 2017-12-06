import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { apolloClient } from './apollo';
import { RootLayout } from './layout';
import { configureStore } from './store';
import { theme } from './styles';

const store = configureStore();

export default () => (
  <MuiThemeProvider muiTheme={theme}>
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <RootLayout />
        </BrowserRouter>
      </ApolloProvider>
    </Provider>
  </MuiThemeProvider>
);
