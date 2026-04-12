import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MockLink } from '@apollo/client/testing';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { ChartProvider, MeasurementsDocument } from '@whitewater-guide/clients';
import type { Meta, StoryObj } from '@storybook/react';
import subDays from 'date-fns/subDays';
import subHours from 'date-fns/subHours';
import React from 'react';

import { ChartPeriodToggle } from './ChartPeriodToggle';

const NOW = new Date();

const MOCK_GAUGE = {
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
        request: { query: MeasurementsDocument },
        result: { data: MOCK_MEASUREMENTS },
        variableMatcher: () => true,
      },
    ],
    true,
  ),
  cache: new InMemoryCache(),
});

interface WrapperProps {
  days?: 1 | 3 | 7 | 31;
}

function Wrapper({ days = 1 }: WrapperProps) {
  const filter = {
    from: subDays(NOW, days).toISOString(),
    to: NOW.toISOString(),
  };
  return (
    <ActionSheetProvider>
      <ApolloProvider client={mockClient}>
        <ChartProvider gauge={MOCK_GAUGE} initialFilter={filter}>
          <ChartPeriodToggle />
        </ChartProvider>
      </ApolloProvider>
    </ActionSheetProvider>
  );
}

const meta: Meta<typeof Wrapper> = {
  title: 'Components/Chart/ChartPeriodToggle',
  component: Wrapper,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const OneDay: Story = { args: { days: 1 } };
export const ThreeDays: Story = { args: { days: 3 } };
export const OneWeek: Story = { args: { days: 7 } };
export const OneMonth: Story = { args: { days: 31 } };
