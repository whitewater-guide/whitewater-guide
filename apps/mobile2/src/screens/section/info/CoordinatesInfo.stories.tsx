import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';

import CoordinatesInfo from './CoordinatesInfo';

const PUT_IN: CodegenCoordinates = [18.5, 49.12, 350];
const TAKE_OUT: CodegenCoordinates = [18.52, 49.09, 320];

const meta: Meta<typeof CoordinatesInfo> = {
  title: 'Section/Info/CoordinatesInfo',
  component: CoordinatesInfo,
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};

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
