import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MockLink } from '@apollo/client/testing';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { ChartProvider, MeasurementsDocument } from '@whitewater-guide/clients';
import { Unit } from '@whitewater-guide/schema';
import type { Meta, StoryObj } from '@storybook/react';
import subHours from 'date-fns/subHours';
import React from 'react';

import { ChartFlowToggle } from './ChartFlowToggle';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const NOW = new Date();

const MOCK_GAUGE_BOTH = {
  __typename: 'Gauge' as const,
  id: 'gauge-1',
  name: 'Test Gauge',
  code: 'TG1',
  flowUnit: 'm³/s',
  levelUnit: 'm',
  url: null,
  timezone: null,
  source: {
    __typename: 'Source' as const,
    id: 'src-1',
    name: 'USGS',
    termsOfUse: null,
  },
  latestMeasurement: {
    __typename: 'Measurement' as const,
    timestamp: NOW.toISOString(),
    flow: 42.5,
    level: 1.8,
  },
};

const MOCK_GAUGE_FLOW_ONLY = {
  ...MOCK_GAUGE_BOTH,
  levelUnit: null,
  latestMeasurement: {
    __typename: 'Measurement' as const,
    timestamp: NOW.toISOString(),
    flow: 42.5,
    level: null,
  },
};

const MOCK_GAUGE_LEVEL_ONLY = {
  ...MOCK_GAUGE_BOTH,
  flowUnit: null,
  latestMeasurement: {
    __typename: 'Measurement' as const,
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

function makeMockClient(gauge: typeof MOCK_GAUGE_BOTH) {
  const link = new MockLink(
    [
      {
        request: { query: MeasurementsDocument },
        result: { data: MOCK_MEASUREMENTS },
        // Match any variables so we don't need to know the exact filter dates
        variableMatcher: () => true,
      },
    ],
    true,
  );
  return new ApolloClient({ link, cache: new InMemoryCache() });
}

// ─── Wrapper ──────────────────────────────────────────────────────────────────

interface WrapperProps {
  gauge: typeof MOCK_GAUGE_BOTH;
  initialUnit?: Unit;
}

function Wrapper({ gauge, initialUnit }: WrapperProps) {
  const client = React.useMemo(() => makeMockClient(gauge), [gauge]);
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
          <ChartFlowToggle />
        </ChartProvider>
      </ApolloProvider>
    </ActionSheetProvider>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Wrapper> = {
  title: 'Components/Chart/ChartFlowToggle',
  component: Wrapper,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const BothUnits: Story = {
  args: { gauge: MOCK_GAUGE_BOTH },
};

export const FlowOnly: Story = {
  args: { gauge: MOCK_GAUGE_FLOW_ONLY as any },
};

export const LevelOnly: Story = {
  args: { gauge: MOCK_GAUGE_LEVEL_ONLY as any },
};
