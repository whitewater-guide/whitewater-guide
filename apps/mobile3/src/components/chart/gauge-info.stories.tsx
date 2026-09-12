import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MockLink } from '@apollo/client/testing';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useMemo } from 'react';
import { View } from 'react-native';

import { ChartProvider } from './chart-provider';
import { subDays, subHours } from './date';
import { GaugeInfo } from './gauge-info';
import { MEASUREMENTS_QUERY } from './measurements';
import type { GaugeForChart } from './types';

const NOW = new Date();

const BASE_GAUGE = {
  id: 'gauge-1',
  name: 'Elbe at Dresden',
  code: 'EAD',
  url: null,
  timezone: null,
  source: {
    id: 'src-1',
    name: 'USGS',
    termsOfUse: null,
  },
};

const GAUGE_BOTH: GaugeForChart = {
  ...BASE_GAUGE,
  flowUnit: 'm³/s',
  levelUnit: 'm',
  latestMeasurement: {
    timestamp: subHours(NOW, 2).toISOString(),
    flow: 42.5,
    level: 1.8,
  },
};

const GAUGE_FLOW_ONLY: GaugeForChart = {
  ...BASE_GAUGE,
  flowUnit: 'm³/s',
  levelUnit: null,
  latestMeasurement: {
    timestamp: subHours(NOW, 1).toISOString(),
    flow: 55.0,
    level: null,
  },
};

const GAUGE_LEVEL_ONLY: GaugeForChart = {
  ...BASE_GAUGE,
  flowUnit: null,
  levelUnit: 'm',
  latestMeasurement: {
    timestamp: subHours(NOW, 3).toISOString(),
    flow: null,
    level: 2.1,
  },
};

const GAUGE_NO_DATA: GaugeForChart = {
  ...BASE_GAUGE,
  flowUnit: 'm³/s',
  levelUnit: 'm',
  latestMeasurement: null,
};

const GAUGE_OUTDATED: GaugeForChart = {
  ...BASE_GAUGE,
  flowUnit: 'm³/s',
  levelUnit: 'm',
  latestMeasurement: {
    timestamp: subDays(NOW, 3).toISOString(),
    flow: 30.0,
    level: 1.2,
  },
};

const EMPTY_MEASUREMENTS = { measurements: [] };

function makeMockClient() {
  return new ApolloClient({
    link: new MockLink(
      [
        {
          request: { query: MEASUREMENTS_QUERY },
          result: { data: EMPTY_MEASUREMENTS },
          variableMatcher: () => true,
          maxUsageCount: Number.POSITIVE_INFINITY,
        },
      ],
      true,
    ),
    cache: new InMemoryCache(),
  });
}

export interface GaugeInfoWrapperProps {
  gauge: GaugeForChart;
}

function Wrapper({ gauge }: GaugeInfoWrapperProps) {
  const client = useMemo(makeMockClient, []);
  return (
    <ApolloProvider client={client}>
      <ChartProvider
        gauge={gauge}
        initialFilter={{
          from: subHours(NOW, 24).toISOString(),
          to: NOW.toISOString(),
        }}
      >
        <View>
          <GaugeInfo />
        </View>
      </ChartProvider>
    </ApolloProvider>
  );
}

const meta = {
  title: 'Components/Chart/GaugeInfo',
  component: Wrapper,
} satisfies Meta<typeof Wrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BothUnits: Story = { args: { gauge: GAUGE_BOTH } };
export const FlowOnly: Story = { args: { gauge: GAUGE_FLOW_ONLY } };
export const LevelOnly: Story = { args: { gauge: GAUGE_LEVEL_ONLY } };
export const NoData: Story = { args: { gauge: GAUGE_NO_DATA } };
export const Outdated: Story = { args: { gauge: GAUGE_OUTDATED } };
