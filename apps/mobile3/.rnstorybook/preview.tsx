import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import type { Preview } from '@storybook/react-native';

import '@/i18n';

const mockApolloClient = new ApolloClient({ cache: new InMemoryCache() });

const preview: Preview = {
  parameters: {},
  decorators: [
    (Story) => (
      <ApolloProvider client={mockApolloClient}>
        <Story />
      </ApolloProvider>
    ),
  ],
};

export default preview;
