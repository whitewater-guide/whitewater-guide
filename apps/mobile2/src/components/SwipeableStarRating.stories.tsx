import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import SwipeableStarRating from './SwipeableStarRating';

function SwipeableStarRatingInteractive({
  initial,
}: {
  initial: number | null;
}) {
  const [value, setValue] = useState<number | null>(initial);
  return (
    <GestureHandlerRootView>
      <View style={{ padding: 16, gap: 8 }}>
        <SwipeableStarRating value={value} onChange={setValue} />
        <Text style={{ color: '#757575' }}>
          {value === null ? 'No rating' : `Rating: ${value}`}
        </Text>
      </View>
    </GestureHandlerRootView>
  );
}

const meta: Meta<typeof SwipeableStarRatingInteractive> = {
  title: 'Components/SwipeableStarRating',
  component: SwipeableStarRatingInteractive,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const NoRating: Story = { args: { initial: null } };
export const Zero: Story = { args: { initial: 0 } };
export const TwoPointFive: Story = { args: { initial: 2.5 } };
export const Five: Story = { args: { initial: 5 } };
