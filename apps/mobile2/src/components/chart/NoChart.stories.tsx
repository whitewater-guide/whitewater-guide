import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import NoChart from './NoChart';

function Container({ reason }: { reason?: 'offline' | 'noData' | 'noGauge' }) {
  return (
    <View style={{ flex: 1, height: 300 }}>
      <NoChart reason={reason} />
    </View>
  );
}

const meta: Meta<typeof Container> = {
  title: 'Components/Chart/NoChart',
  component: Container,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const NoGauge: Story = {
  args: { reason: 'noGauge' },
};

export const NoData: Story = {
  args: { reason: 'noData' },
};

export const Offline: Story = {
  args: { reason: 'offline' },
};
