import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { NoChart, type NoChartReason } from './no-chart';

export interface NoChartContainerProps {
  reason?: NoChartReason;
}

function Container({ reason }: NoChartContainerProps) {
  return (
    <View style={{ flex: 1, height: 300 }}>
      <NoChart reason={reason} />
    </View>
  );
}

const meta = {
  title: 'Components/Chart/NoChart',
  component: Container,
} satisfies Meta<typeof Container>;

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
