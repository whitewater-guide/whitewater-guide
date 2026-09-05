import type { Meta, StoryObj } from '@storybook/react-native';

import { FormikDecorator } from './formik-decorator';
import { ModalPickerField } from './modal-picker-field';

const options = [1, 2, 3, 4, 5, 6];

function valueToString(value: number): string {
  return String(value);
}

function keyExtractor(value: number): string {
  return String(value);
}

interface DifficultyFormValues {
  difficulty: number | null;
}

interface NumberPickerFieldProps {
  name: string;
  label: string;
  placeholder?: string;
}

function NumberPickerField(props: NumberPickerFieldProps) {
  return (
    <ModalPickerField
      {...props}
      options={options}
      valueToString={valueToString}
      keyExtractor={keyExtractor}
    />
  );
}

const DEFAULT_VALUES: DifficultyFormValues = { difficulty: null };

const meta = {
  title: 'Forms/ModalPickerField',
  component: NumberPickerField,
  decorators: [
    (Story, { parameters }) => (
      <FormikDecorator
        initialValues={
          (parameters.formikInitialValues as DifficultyFormValues | undefined) ??
          DEFAULT_VALUES
        }
      >
        <Story />
      </FormikDecorator>
    ),
  ],
} satisfies Meta<typeof NumberPickerField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Pristine: Story = {
  args: {
    name: 'difficulty',
    label: 'Difficulty',
    placeholder: 'Select',
  },
};

export const WithValue: Story = {
  args: {
    name: 'difficulty',
    label: 'Difficulty',
  },
  parameters: {
    formikInitialValues: { difficulty: 3 } satisfies DifficultyFormValues,
  },
};
