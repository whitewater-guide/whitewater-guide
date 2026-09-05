import type { Meta, StoryObj } from '@storybook/react-native';
import { TagCategory } from '@whitewater-guide/schema';

import { FormikDecorator } from './formik-decorator';
import { TagsField } from './tags-field';

const options = [
  { id: '1', name: 'Kayaking', category: TagCategory.Kayaking },
  { id: '2', name: 'Rafting', category: TagCategory.Kayaking },
  { id: '3', name: 'Canoeing', category: TagCategory.Kayaking },
];

interface TagsFormValues {
  tags: Array<{ id: string }>;
}

const DEFAULT_VALUES: TagsFormValues = { tags: [] };

const meta = {
  title: 'Forms/TagsField',
  component: TagsField,
  argTypes: {
    options: { control: false },
  },
  decorators: [
    (Story, { parameters }) => (
      <FormikDecorator
        initialValues={
          (parameters.formikInitialValues as TagsFormValues | undefined) ??
          DEFAULT_VALUES
        }
      >
        <Story />
      </FormikDecorator>
    ),
  ],
} satisfies Meta<typeof TagsField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { name: 'tags', label: 'Tags', options },
};

export const WithSelection: Story = {
  args: { name: 'tags', label: 'Tags', options },
  parameters: {
    formikInitialValues: { tags: [{ id: '1' }] } satisfies TagsFormValues,
  },
};
