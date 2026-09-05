import type { Meta, StoryObj } from '@storybook/react-native';

import { FormikDecorator } from './formik-decorator';
import { RatingField } from './rating-field';

interface RatingFormValues {
  rating: number | null;
}

const DEFAULT_VALUES: RatingFormValues = { rating: null };

const meta = {
  title: 'Forms/RatingField',
  component: RatingField,
  decorators: [
    (Story, { parameters }) => (
      <FormikDecorator
        initialValues={
          (parameters.formikInitialValues as RatingFormValues | undefined) ??
          DEFAULT_VALUES
        }
      >
        <Story />
      </FormikDecorator>
    ),
  ],
} satisfies Meta<typeof RatingField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { name: 'rating', label: 'Rating' },
};

export const WithValue: Story = {
  args: { name: 'rating', label: 'Rating' },
  parameters: {
    formikInitialValues: { rating: 3.5 } satisfies RatingFormValues,
  },
};
