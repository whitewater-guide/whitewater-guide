import type { Meta, StoryObj } from '@storybook/react-native';

import { FormikDecorator } from './formik-decorator';
import { NumericField } from './numeric-field';

interface NumericFormValues {
  value: number | null;
}

const DEFAULT_VALUES: NumericFormValues = { value: null };

const meta = {
  title: 'Forms/NumericField',
  component: NumericField,
  decorators: [
    (Story, { parameters }) => (
      <FormikDecorator
        initialValues={
          (parameters.formikInitialValues as NumericFormValues | undefined) ??
          DEFAULT_VALUES
        }
      >
        <Story />
      </FormikDecorator>
    ),
  ],
} satisfies Meta<typeof NumericField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Pristine: Story = { args: { name: 'value', label: 'Level' } };

export const Filled: Story = {
  args: { name: 'value', label: 'Level' },
  parameters: {
    formikInitialValues: { value: 1.5 } satisfies NumericFormValues,
  },
};

export const Disabled: Story = {
  args: { name: 'value', label: 'Level', disabled: true },
};
