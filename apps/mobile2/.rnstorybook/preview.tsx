import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import type { Preview } from '@storybook/react';
import React from 'react';
import { PaperProvider } from 'react-native-paper';

import { I18nProvider } from '../src/i18n';

const mockApolloClient = new ApolloClient({ cache: new InMemoryCache() });

const preview: Preview = {
  parameters: {},
  decorators: [
    (Story) => (
      <ApolloProvider client={mockApolloClient}>
        <PaperProvider>
          <I18nProvider>
            <Story />
          </I18nProvider>
        </PaperProvider>
      </ApolloProvider>
    ),
  ],
};

export default preview;
