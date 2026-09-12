import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MockLink } from '@apollo/client/testing';
import type { Meta, StoryObj } from '@storybook/react-native';

import { ChartPeriodToggle } from './chart-period-toggle';
import { ChartProvider } from './chart-provider';
import { subDays, subHours } from './date';
import { MEASUREMENTS_QUERY } from './measurements';
import type { GaugeForChart } from './types';

const NOW = new Date();

const MOCK_GAUGE: GaugeForChart = {
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
  latestMeasurement: null,
};

const MOCK_MEASUREMENTS = {
  measurements: Array.from({ length: 24 }, (_, i) => ({
    __typename: 'Measurement' as const,
    timestamp: subHours(NOW, 23 - i).toISOString(),
    flow: 30 + 20 * Math.random(),
    level: 1.2 + 0.5 * Math.random(),
  })),
};

const mockClient = new ApolloClient({
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

export interface ChartPeriodToggleWrapperProps {
  days?: 1 | 3 | 7 | 31;
}

function Wrapper({ days = 1 }: ChartPeriodToggleWrapperProps) {
  const filter = {
    from: subDays(NOW, days).toISOString(),
    to: NOW.toISOString(),
  };
  return (
    <ApolloProvider client={mockClient}>
      <ChartProvider gauge={MOCK_GAUGE} initialFilter={filter}>
        <ChartPeriodToggle />
      </ChartProvider>
    </ApolloProvider>
  );
}

const meta = {
  title: 'Components/Chart/ChartPeriodToggle',
  component: Wrapper,
} satisfies Meta<typeof Wrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OneDay: Story = { args: { days: 1 } };
export const ThreeDays: Story = { args: { days: 3 } };
export const OneWeek: Story = { args: { days: 7 } };
export const OneMonth: Story = { args: { days: 31 } };
