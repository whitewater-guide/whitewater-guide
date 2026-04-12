import type { Meta, StoryObj } from '@storybook/react';
import { Unit } from '@whitewater-guide/schema';
import subHours from 'date-fns/subHours';
import React from 'react';
import { View } from 'react-native';

import ChartComponent from './ChartComponent';

// ─── Fixtures ────────────────────────────────────────────────────────────────

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
  latestMeasurement: {
    __typename: 'Measurement' as const,
    timestamp: NOW.toISOString(),
    flow: 42.5,
    level: 1.8,
  },
};

const MOCK_SECTION = {
  __typename: 'Section' as const,
  id: 'section-1',
  flowsText: null,
  timezone: null,
  flows: {
    __typename: 'GaugeBinding' as const,
    minimum: 20,
    optimum: 40,
    maximum: 80,
    impossible: 120,
    approximate: false,
    formula: null,
  },
  levels: {
    __typename: 'GaugeBinding' as const,
    minimum: 0.8,
    optimum: 1.5,
    maximum: 2.5,
    impossible: 3.5,
    approximate: false,
    formula: null,
  },
};

// 24 hours of mock measurements
const FLOW_DATA = Array.from({ length: 24 }, (_, i) => ({
  timestamp: subHours(NOW, 23 - i),
  flow: 30 + 30 * Math.sin((i / 23) * Math.PI),
  level: 1.2 + 0.8 * Math.sin((i / 23) * Math.PI),
}));

const FILTER_1D = {
  from: subHours(NOW, 24).toISOString(),
  to: NOW.toISOString(),
};

// ─── Story wrapper ────────────────────────────────────────────────────────────

interface WrapperProps {
  unit?: Unit;
  empty?: boolean;
}

function ChartWrapper({ unit = Unit.FLOW, empty = false }: WrapperProps) {
  return (
    <View style={{ width: 360, height: 300 }}>
      <ChartComponent
        data={empty ? [] : FLOW_DATA}
        unit={unit}
        gauge={MOCK_GAUGE}
        section={MOCK_SECTION}
        filter={FILTER_1D}
        width={360}
        height={300}
      />
    </View>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof ChartWrapper> = {
  title: 'Components/Chart/ChartComponent',
  component: ChartWrapper,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const FlowUnit: Story = {
  args: { unit: Unit.FLOW },
};

export const LevelUnit: Story = {
  args: { unit: Unit.LEVEL },
};

export const NoData: Story = {
  args: { unit: Unit.FLOW, empty: true },
};
