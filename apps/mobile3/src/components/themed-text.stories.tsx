import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { ThemedText } from './themed-text';

const meta = {
  title: 'Components/ThemedText',
  component: ThemedText,
  args: {
    children: 'Themed text',
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ThemedText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { type: 'default' } };
export const Title: Story = { args: { type: 'title' } };
export const Subtitle: Story = { args: { type: 'subtitle' } };
export const Small: Story = { args: { type: 'small' } };
export const SmallBold: Story = { args: { type: 'smallBold' } };
export const Link: Story = { args: { type: 'link' } };
export const LinkPrimary: Story = { args: { type: 'linkPrimary' } };
export const Code: Story = {
  args: { type: 'code', children: 'src/app/_layout.tsx' },
};
