import type { Meta, StoryObj } from '@storybook/react';

import { FormikDecorator } from './__stories__/FormikDecorator';
import RatingField from './RatingField';

const meta: Meta<typeof RatingField> = {
  title: 'Forms/RatingField',
  component: RatingField,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { name: 'rating', label: 'Rating' },
  decorators: [
    (Story) => (
      <FormikDecorator initialValues={{ rating: null }}>
        <Story />
      </FormikDecorator>
    ),
  ],
};

export const WithValue: Story = {
  args: { name: 'rating', label: 'Rating' },
  decorators: [
    (Story) => (
      <FormikDecorator initialValues={{ rating: 3.5 }}>
        <Story />
      </FormikDecorator>
    ),
  ],
};
