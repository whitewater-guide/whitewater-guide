import { ApolloProvider } from '@apollo/client';
import { AuthProvider, TagsProvider } from '@whitewater-guide/clients';
import type { FC } from 'react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { useClient } from './apollo';
import { Loading } from './components';
import { RootLayout } from './layout';
import MuiProviders from './MuiProviders';
import { SentryRouterBreadcrumbs } from './utils';

const AppEngine: FC = () => {
  const { apolloClient, authService } = useClient();
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider service={authService} renderInitializing={<Loading />}>
        <TagsProvider>
          <BrowserRouter>
            <SentryRouterBreadcrumbs />
            <RootLayout />
          </BrowserRouter>
        </TagsProvider>
      </AuthProvider>
    </ApolloProvider>
  );
};

const App: FC = () => {
  return (
    <MuiProviders>
      <AppEngine />
    </MuiProviders>
  );
};

export default App;
