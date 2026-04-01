import type { Meta, StoryObj } from '@storybook/react';

import RetryPlaceholder from './RetryPlaceholder';

const meta: Meta<typeof RetryPlaceholder> = {
  title: 'Components/RetryPlaceholder',
  component: RetryPlaceholder,
  args: {
    refetch: () => {},
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutRefetch: Story = {
  args: {
    refetch: undefined,
  },
};
