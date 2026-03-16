import type { Preview } from '@storybook/react';
import React from 'react';
import { PaperProvider } from 'react-native-paper';

const preview: Preview = {
  parameters: {},
  decorators: [
    (Story) => (
      <PaperProvider>
        <Story />
      </PaperProvider>
    ),
  ],
};

export default preview;
