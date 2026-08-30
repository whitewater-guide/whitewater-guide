import type { Meta, StoryObj } from '@storybook/react-native';

import { SimpleStarRating } from './simple-star-rating';

const meta = {
  title: 'Components/SimpleStarRating',
  component: SimpleStarRating,
} satisfies Meta<typeof SimpleStarRating>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Zero: Story = { args: { value: 0 } };
export const One: Story = { args: { value: 1 } };
export const TwoPointFive: Story = { args: { value: 2.5 } };
export const Five: Story = { args: { value: 5 } };
export const NullValue: Story = { args: { value: null } };
