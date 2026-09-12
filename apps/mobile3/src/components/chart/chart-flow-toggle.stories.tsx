import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MockLink } from '@apollo/client/testing';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Unit } from '@whitewater-guide/schema';
import { useMemo } from 'react';

import { ChartFlowToggle } from './chart-flow-toggle';
import { ChartProvider } from './chart-provider';
import { subHours } from './date';
import { MEASUREMENTS_QUERY } from './measurements';
import type { GaugeForChart } from './types';

const NOW = new Date();

const MOCK_GAUGE_BOTH: GaugeForChart = {
  id: 'gauge-1',
  name: 'Test Gauge',
  code: 'TG1',
  flowUnit: 'm³/s',
  levelUnit: 'm',
  url: null,
  timezone: null,
  source: {
    id: 'src-1',
    name: 'USGS',
    termsOfUse: null,
  },
  latestMeasurement: {
    timestamp: NOW.toISOString(),
    flow: 42.5,
    level: 1.8,
  },
};

const MOCK_GAUGE_FLOW_ONLY: GaugeForChart = {
  ...MOCK_GAUGE_BOTH,
  levelUnit: null,
  latestMeasurement: {
    timestamp: NOW.toISOString(),
    flow: 42.5,
    level: null,
  },
};

const MOCK_GAUGE_LEVEL_ONLY: GaugeForChart = {
  ...MOCK_GAUGE_BOTH,
  flowUnit: null,
  latestMeasurement: {
    timestamp: NOW.toISOString(),
    flow: null,
    level: 1.8,
  },
};

const MOCK_MEASUREMENTS = {
  measurements: Array.from({ length: 24 }, (_, i) => ({
    __typename: 'Measurement' as const,
    timestamp: subHours(NOW, 23 - i).toISOString(),
    flow: 30 + 30 * Math.sin((i / 23) * Math.PI),
    level: 1.2 + 0.8 * Math.sin((i / 23) * Math.PI),
  })),
};

function makeMockClient() {
  return new ApolloClient({
    link: new MockLink(
      [
        {
          request: { query: MEASUREMENTS_QUERY },
          result: { data: MOCK_MEASUREMENTS },
          variableMatcher: () => true,
          maxUsageCount: Number.POSITIVE_INFINITY,
        },
      ],
      true,
    ),
    cache: new InMemoryCache(),
  });
}

export interface ChartFlowToggleWrapperProps {
  gauge: GaugeForChart;
  initialUnit?: Unit;
}

function Wrapper({ gauge }: ChartFlowToggleWrapperProps) {
  const client = useMemo(() => makeMockClient(), []);
  return (
    <ApolloProvider client={client}>
      <ChartProvider
        gauge={gauge}
        initialFilter={{
          from: subHours(NOW, 24).toISOString(),
          to: NOW.toISOString(),
        }}
      >
        <ChartFlowToggle />
      </ChartProvider>
    </ApolloProvider>
  );
}

const meta = {
  title: 'Components/Chart/ChartFlowToggle',
  component: Wrapper,
} satisfies Meta<typeof Wrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BothUnits: Story = {
  args: { gauge: MOCK_GAUGE_BOTH },
};

export const FlowOnly: Story = {
  args: { gauge: MOCK_GAUGE_FLOW_ONLY },
};

export const LevelOnly: Story = {
  args: { gauge: MOCK_GAUGE_LEVEL_ONLY },
};
