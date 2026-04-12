import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
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
        <ActionSheetProvider>
          <PaperProvider>
            <I18nProvider>
              <Story />
            </I18nProvider>
          </PaperProvider>
        </ActionSheetProvider>
      </ApolloProvider>
    ),
  ],
};

export default preview;
