import type { Meta, StoryObj } from '@storybook/react';

import { FormikDecorator } from './__stories__/FormikDecorator';
import CheckboxField from './CheckboxField';

const meta: Meta<typeof CheckboxField> = {
  title: 'Forms/CheckboxField',
  component: CheckboxField,
  decorators: [
    (Story) => (
      <FormikDecorator initialValues={{ public: false }}>
        <Story />
      </FormikDecorator>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked: Story = { args: { name: 'public', label: 'Public' } };

export const Checked: Story = {
  args: { name: 'public', label: 'Public' },
  decorators: [
    (Story) => (
      <FormikDecorator initialValues={{ public: true }}>
        <Story />
      </FormikDecorator>
    ),
  ],
};
