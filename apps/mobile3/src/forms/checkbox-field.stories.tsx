import type { Meta, StoryObj } from '@storybook/react-native';

import { CheckboxField } from './checkbox-field';
import { FormikDecorator } from './formik-decorator';

interface CheckboxFormValues {
  public: boolean;
}

const DEFAULT_VALUES: CheckboxFormValues = { public: false };

const meta = {
  title: 'Forms/CheckboxField',
  component: CheckboxField,
  decorators: [
    (Story, { parameters }) => (
      <FormikDecorator
        initialValues={
          (parameters.formikInitialValues as CheckboxFormValues | undefined) ??
          DEFAULT_VALUES
        }
      >
        <Story />
      </FormikDecorator>
    ),
  ],
} satisfies Meta<typeof CheckboxField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked: Story = { args: { name: 'public', label: 'Public' } };

export const Checked: Story = {
  args: { name: 'public', label: 'Public' },
  parameters: {
    formikInitialValues: { public: true } satisfies CheckboxFormValues,
  },
};
