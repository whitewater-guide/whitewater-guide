import type { Preview } from '@storybook/react';
import React from 'react';
import { PaperProvider } from 'react-native-paper';

import { I18nProvider } from '../src/i18n';

const preview: Preview = {
  parameters: {},
  decorators: [
    (Story) => (
      <PaperProvider>
        <I18nProvider>
          <Story />
        </I18nProvider>
      </PaperProvider>
    ),
  ],
};

export default preview;
