import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';

import TextWithLinks from './TextWithLinks';

function noop() {}

const meta: Meta<typeof TextWithLinks> = {
  title: 'Components/TextWithLinks',
  component: TextWithLinks,
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const PlainText: Story = {
  args: {
    children: 'This is plain text with no links.',
    onLink: noop,
  },
};

export const SingleLink: Story = {
  args: {
    children: 'Read the [terms of service](1).',
    onLink: noop,
  },
};

export const MultipleLinks: Story = {
  args: {
    children: 'See [Privacy Policy](1) and [Terms of Use](2).',
    onLink: noop,
  },
};

export const MixedTextAndLinks: Story = {
  args: {
    children:
      'The content you are adding will be published under an open license (CC). See our [Terms of Use](1) for details.',
    onLink: noop,
  },
};
