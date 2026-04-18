import type { Meta, StoryObj } from '@storybook/react';
import { TagCategory } from '@whitewater-guide/schema';

import { FormikDecorator } from './__stories__/FormikDecorator';
import TagsField from './TagsField';

const options = [
  { id: '1', name: 'Kayaking', category: TagCategory.Kayaking },
  { id: '2', name: 'Rafting', category: TagCategory.Kayaking },
  { id: '3', name: 'Canoeing', category: TagCategory.Kayaking },
];

const meta: Meta<typeof TagsField> = {
  title: 'Forms/TagsField',
  component: TagsField,
  decorators: [
    (Story) => (
      <FormikDecorator initialValues={{ tags: [] }}>
        <Story />
      </FormikDecorator>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { name: 'tags', label: 'Tags', options },
};

export const WithSelection: Story = {
  args: { name: 'tags', label: 'Tags', options },
  decorators: [
    (Story) => (
      <FormikDecorator initialValues={{ tags: [{ id: '1' }] }}>
        <Story />
      </FormikDecorator>
    ),
  ],
};
