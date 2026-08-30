import type { Meta, StoryObj } from '@storybook/react-native';

import RetryPlaceholder from './retry-placeholder';

const meta = {
  title: 'Components/RetryPlaceholder',
  component: RetryPlaceholder,
  args: {
    refetch: () => {},
  },
} satisfies Meta<typeof RetryPlaceholder>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutRefetch: Story = {
  args: {
    refetch: undefined,
  },
};
