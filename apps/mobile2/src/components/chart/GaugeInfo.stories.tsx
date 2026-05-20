import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MockLink } from '@apollo/client/testing';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import type { Meta, StoryObj } from '@storybook/react';
import { ChartProvider, MeasurementsDocument } from '@whitewater-guide/clients';
import subDays from 'date-fns/subDays';
import subHours from 'date-fns/subHours';
import React from 'react';
import { View } from 'react-native';

import { GaugeInfo } from './GaugeInfo';

const NOW = new Date();

// ─── Gauge fixtures ───────────────────────────────────────────────────────────

const BASE_GAUGE = {
  __typename: 'Gauge' as const,
  id: 'gauge-1',
  name: 'Elbe at Dresden',
  code: 'EAD',
  url: null,
  timezone: null,
  source: {
    __typename: 'Source' as const,
    id: 'src-1',
    name: 'USGS',
    termsOfUse: null,
  },
};

const GAUGE_BOTH = {
  ...BASE_GAUGE,
  flowUnit: 'm³/s',
  levelUnit: 'm',
  latestMeasurement: {
    __typename: 'Measurement' as const,
    timestamp: subHours(NOW, 2).toISOString(),
    flow: 42.5,
    level: 1.8,
  },
};

const GAUGE_FLOW_ONLY = {
  ...BASE_GAUGE,
  flowUnit: 'm³/s',
  levelUnit: null,
  latestMeasurement: {
    __typename: 'Measurement' as const,
    timestamp: subHours(NOW, 1).toISOString(),
    flow: 55.0,
    level: null,
  },
};

const GAUGE_LEVEL_ONLY = {
  ...BASE_GAUGE,
  flowUnit: null,
  levelUnit: 'm',
  latestMeasurement: {
    __typename: 'Measurement' as const,
    timestamp: subHours(NOW, 3).toISOString(),
    flow: null,
    level: 2.1,
  },
};

const GAUGE_NO_DATA = {
  ...BASE_GAUGE,
  flowUnit: 'm³/s',
  levelUnit: 'm',
  latestMeasurement: null,
};

const GAUGE_OUTDATED = {
  ...BASE_GAUGE,
  flowUnit: 'm³/s',
  levelUnit: 'm',
  latestMeasurement: {
    __typename: 'Measurement' as const,
    timestamp: subDays(NOW, 3).toISOString(),
    flow: 30.0,
    level: 1.2,
  },
};

// ─── Mock Apollo client ───────────────────────────────────────────────────────

const EMPTY_MEASUREMENTS = { measurements: [] };

function makeMockClient() {
  return new ApolloClient({
    link: new MockLink(
      [
        {
          request: { query: MeasurementsDocument },
          result: { data: EMPTY_MEASUREMENTS },
          variableMatcher: () => true,
        },
      ],
      true,
    ),
    cache: new InMemoryCache(),
  });
}

// ─── Wrapper ──────────────────────────────────────────────────────────────────

function Wrapper({ gauge }: { gauge: typeof GAUGE_BOTH }) {
  const client = React.useMemo(makeMockClient, []);
  return (
    <ActionSheetProvider>
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
    </ActionSheetProvider>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Wrapper> = {
  title: 'Components/Chart/GaugeInfo',
  component: Wrapper,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const BothUnits: Story = { args: { gauge: GAUGE_BOTH } };
export const FlowOnly: Story = { args: { gauge: GAUGE_FLOW_ONLY as any } };
export const LevelOnly: Story = { args: { gauge: GAUGE_LEVEL_ONLY as any } };
export const NoData: Story = { args: { gauge: GAUGE_NO_DATA as any } };
export const Outdated: Story = { args: { gauge: GAUGE_OUTDATED } };
