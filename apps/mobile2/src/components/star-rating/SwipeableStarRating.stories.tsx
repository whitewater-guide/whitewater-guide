import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Text, View } from 'react-native';
import { useArgs } from 'storybook/preview-api';

import { SwipeableStarRating } from './SwipeableStarRating';

const meta: Meta<typeof SwipeableStarRating> = {
  title: 'Components/SwipeableStarRating',
  component: SwipeableStarRating,
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [{ value }, updateArgs] = useArgs();

    function onChange(v: number) {
      updateArgs({ value: v });
    }

    return (
      <View style={{ padding: 16, gap: 8 }}>
        <SwipeableStarRating {...args} value={value} onChange={onChange} />
        <Text style={{ color: '#757575' }}>
          {value === null ? 'No rating' : `Rating: ${value}`}
        </Text>
      </View>
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const NoRating: Story = { args: { value: null } };
export const Zero: Story = { args: { value: 0 } };
export const TwoPointFive: Story = { args: { value: 2.5 } };
export const Five: Story = { args: { value: 5 } };
