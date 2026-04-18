import type { Meta, StoryObj } from '@storybook/react';
import { PaperProvider } from 'react-native-paper';

import { paperTheme } from '../../theme';
import { FormikDecorator } from '../__stories__/FormikDecorator';
import { ModalPickerField } from './ModalPickerField';

const options = [1, 2, 3, 4, 5, 6];
const valueToString = (v: number | null) => (v !== null ? String(v) : '');
const keyExtractor = (v: number) => String(v);

const meta: Meta<typeof ModalPickerField<number>> = {
  title: 'Forms/ModalPickerField',
  component: ModalPickerField,
  parameters: {
    formikInitialValues: { difficulty: null },
  },
  decorators: [
    (Story, { parameters }) => (
      <PaperProvider theme={paperTheme}>
        <FormikDecorator initialValues={parameters.formikInitialValues}>
          <Story />
        </FormikDecorator>
      </PaperProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Pristine: Story = {
  args: {
    name: 'difficulty',
    label: 'Difficulty',
    options,
    valueToString,
    keyExtractor,
  },
};

export const WithValue: Story = {
  args: {
    name: 'difficulty',
    label: 'Difficulty',
    options,
    valueToString,
    keyExtractor,
  },
  parameters: {
    formikInitialValues: { difficulty: 3 },
  },
};
