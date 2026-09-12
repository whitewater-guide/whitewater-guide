import type { Meta, StoryObj } from '@storybook/react-native';
import { Unit } from '@whitewater-guide/schema';
import { View } from 'react-native';

import { ChartComponent } from './chart-component';
import { subHours } from './date';
import type { GaugeForChart, SectionForChart } from './types';

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
  latestMeasurement: {
    timestamp: NOW.toISOString(),
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

const FLOW_DATA = Array.from({ length: 24 }, (_, i) => ({
  timestamp: subHours(NOW, 23 - i),
  flow: 30 + 30 * Math.sin((i / 23) * Math.PI),
  level: 1.2 + 0.8 * Math.sin((i / 23) * Math.PI),
}));

const FLOW_DATA_BELOW_MIN = Array.from({ length: 24 }, (_, i) => ({
  timestamp: subHours(NOW, 23 - i),
  flow: 40 - (i / 23) * 35,
  level: 1.5 - (i / 23) * 1.3,
}));

const FILTER_1D = {
  from: subHours(NOW, 24).toISOString(),
  to: NOW.toISOString(),
};

export interface ChartWrapperProps {
  unit?: Unit;
  empty?: boolean;
  belowMin?: boolean;
}

function ChartWrapper({
  unit = Unit.FLOW,
  empty = false,
  belowMin = false,
}: ChartWrapperProps) {
  const data = empty ? [] : belowMin ? FLOW_DATA_BELOW_MIN : FLOW_DATA;
  return (
    <View style={{ width: 360, height: 300 }}>
      <ChartComponent
        data={data}
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

const meta = {
  title: 'Components/Chart/ChartComponent',
  component: ChartWrapper,
} satisfies Meta<typeof ChartWrapper>;

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

export const BelowMinimum: Story = {
  args: { unit: Unit.FLOW, belowMin: true },
};
