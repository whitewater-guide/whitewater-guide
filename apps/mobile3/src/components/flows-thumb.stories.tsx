import type { Meta, StoryObj } from '@storybook/react-native';

import FlowsThumb from './flows-thumb';

const meta = {
  title: 'Components/FlowsThumb',
  component: FlowsThumb,
} satisfies Meta<typeof FlowsThumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoData: Story = {
  args: { section: {} },
};

export const NumericFlow: Story = {
  args: {
    section: {
      flowsThumb: {
        color: '#4CAF50',
        value: '42',
        unit: 'm3s',
        fromNow: '2h ago',
      },
    },
  },
};

export const WithinRange: Story = {
  args: {
    section: {
      flowsThumb: {
        color: '#4CAF50',
        value: '1.2',
        unit: 'm',
        fromNow: '30min ago',
      },
    },
  },
};

export const Above: Story = {
  args: {
    section: {
      flowsThumb: {
        color: '#f44336',
        value: '120',
        unit: 'm3s',
        fromNow: '1h ago',
      },
    },
  },
};

export const Below: Story = {
  args: {
    section: {
      flowsThumb: {
        color: '#9E9E9E',
        value: '5',
        unit: 'm3s',
        fromNow: '3h ago',
      },
    },
  },
};
