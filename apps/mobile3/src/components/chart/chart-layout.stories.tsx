import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MockLink } from '@apollo/client/testing';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { ChartLayout } from './chart-layout';
import { subHours } from './date';
import { MEASUREMENTS_QUERY } from './measurements';
import type { GaugeForChart, SectionForChart } from './types';

const NOW = new Date();

const MOCK_GAUGE: GaugeForChart = {
  id: 'gauge-1',
  name: 'Elbe at Dresden',
  code: 'EAD',
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
    timestamp: subHours(NOW, 1).toISOString(),
    flow: 42.5,
    level: 1.8,
  },
};

const MOCK_SECTION: SectionForChart = {
  id: 'section-1',
  flowsText: null,
  timezone: null,
  flows: {
    minimum: 20,
    optimum: 40,
    maximum: 80,
    impossible: 120,
    approximate: false,
    formula: null,
  },
  levels: {
    minimum: 0.8,
    optimum: 1.5,
    maximum: 2.5,
    impossible: 3.5,
    approximate: false,
    formula: null,
  },
};

const MOCK_MEASUREMENTS = {
  measurements: Array.from({ length: 48 }, (_, i) => ({
    __typename: 'Measurement' as const,
    timestamp: subHours(NOW, 47 - i).toISOString(),
    flow: 30 + 30 * Math.sin((i / 47) * Math.PI),
    level: 1.2 + 0.8 * Math.sin((i / 47) * Math.PI),
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

export interface ChartLayoutWrapperProps {
  collapsed?: boolean;
}

function Wrapper({ collapsed = false }: ChartLayoutWrapperProps) {
  return (
    <ApolloProvider client={mockClient}>
      <View style={{ flex: 1, height: 500 }}>
        <ChartLayout
          gauge={MOCK_GAUGE}
          section={MOCK_SECTION}
          collapsed={collapsed}
        />
      </View>
    </ApolloProvider>
  );
}

const meta = {
  title: 'Components/Chart/ChartLayout',
  component: Wrapper,
} satisfies Meta<typeof Wrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { collapsed: false },
};

export const Collapsed: Story = {
  args: { collapsed: true },
};
