import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useArgs } from 'storybook/preview-api';

import { SwipeableStarRating } from './swipeable-star-rating';

import { ThemedText } from '@/components/themed-text';

const meta = {
  title: 'Components/SwipeableStarRating',
  component: SwipeableStarRating,
  decorators: [
    (Story) => (
      <GestureHandlerRootView>
        <Story />
      </GestureHandlerRootView>
    ),
  ],
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    function onChange(v: number) {
      updateArgs({ value: v });
    }

    return (
      <View style={{ padding: 16, gap: 8 }}>
        <SwipeableStarRating {...args} value={value} onChange={onChange} />
        <ThemedText type="small" themeColor="textSecondary">
          {value === null ? 'No rating' : `Rating: ${value}`}
        </ThemedText>
      </View>
    );
  },
} satisfies Meta<typeof SwipeableStarRating>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoRating: Story = { args: { value: null } };
export const Zero: Story = { args: { value: 0 } };
export const TwoPointFive: Story = { args: { value: 2.5 } };
export const Five: Story = { args: { value: 5 } };
