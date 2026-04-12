import { Canvas, matchFont } from '@shopify/react-native-skia';
import type { Meta, StoryObj } from '@storybook/react';
import { Unit } from '@whitewater-guide/schema';
import React from 'react';
import { Platform, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { Crosshair } from './Crosshair';

const CHART_BOUNDS = { left: 50, right: 300, top: 20, bottom: 220 };
const CANVAS_W = 350;
const CANVAS_H = 260;

const MOCK_GAUGE = {
  flowUnit: 'm³/s',
  levelUnit: 'm',
  timezone: null,
} as const;

const FONT_FAMILY =
  Platform.select({ ios: 'Helvetica Neue', android: 'Roboto' }) ?? 'sans-serif';

function CrosshairCanvas({
  unit = Unit.FLOW,
}: {
  unit?: Unit;
}) {
  const font = matchFont({ fontFamily: FONT_FAMILY, fontSize: 10 });
  // Fixed press position in the middle of the mock chart area
  const x = useSharedValue(175);
  const y = useSharedValue(120);
  const xValue = useSharedValue(Date.now() - 3_600_000); // 1 h ago
  const yValue = useSharedValue(25.3);

  return (
    <View style={{ width: CANVAS_W, height: CANVAS_H }}>
      <Canvas style={{ flex: 1 }}>
        <Crosshair
          x={x}
          y={y}
          xValue={xValue}
          yValue={yValue}
          chartBounds={CHART_BOUNDS}
          unit={unit}
          gauge={MOCK_GAUGE}
          font={font}
        />
      </Canvas>
    </View>
  );
}

const meta: Meta<typeof CrosshairCanvas> = {
  title: 'Components/Chart/Crosshair',
  component: CrosshairCanvas,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const FlowUnit: Story = {
  args: { unit: Unit.FLOW },
};

export const LevelUnit: Story = {
  args: { unit: Unit.LEVEL },
};
