import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import CoordinatesInfo from './coordinates-info';

import type { Coordinates } from '@/types/coordinates';

const PUT_IN: Coordinates = [18.5, 49.12, 350];
const TAKE_OUT: Coordinates = [18.52, 49.09, 320];

const meta = {
  title: 'Section/Info/CoordinatesInfo',
  component: CoordinatesInfo,
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof CoordinatesInfo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BothCoordinates: Story = {
  args: {
    putIn: PUT_IN,
    takeOut: TAKE_OUT,
  },
};

export const PutInOnly: Story = {
  args: {
    putIn: PUT_IN,
    takeOut: null,
  },
};

export const None: Story = {
  args: {
    putIn: null,
    takeOut: null,
  },
};
