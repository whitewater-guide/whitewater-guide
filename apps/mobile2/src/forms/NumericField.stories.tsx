import type { Meta, StoryObj } from '@storybook/react';

import { FormikDecorator } from './__stories__/FormikDecorator';
import NumericField from './NumericField';

const meta: Meta<typeof NumericField> = {
  title: 'Forms/NumericField',
  component: NumericField,
  decorators: [
    (Story) => (
      <FormikDecorator initialValues={{ value: null }}>
        <Story />
      </FormikDecorator>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Pristine: Story = { args: { name: 'value', label: 'Level' } };

export const Filled: Story = {
  args: { name: 'value', label: 'Level' },
  decorators: [
    (Story) => (
      <FormikDecorator initialValues={{ value: 1.5 }}>
        <Story />
      </FormikDecorator>
    ),
  ],
};

export const Disabled: Story = {
  args: { name: 'value', label: 'Level', disabled: true },
};
