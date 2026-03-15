import type { Meta, StoryObj } from '@storybook/react';

import HelloWorld from './HelloWorld';

const meta: Meta<typeof HelloWorld> = {
  title: 'HelloWorld',
  component: HelloWorld,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithName: Story = {
  args: {
    name: 'Storybook',
  },
};
