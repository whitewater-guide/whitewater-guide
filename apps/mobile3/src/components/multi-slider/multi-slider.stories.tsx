import type { Meta, StoryObj } from '@storybook/react-native';
import { Duration } from '@whitewater-guide/schema';
import { useState } from 'react';
import { View } from 'react-native';

import MultiSlider from './multi-slider';

export interface MultiSliderInteractiveProps {
  min: number;
  max: number;
  step: number;
  behavior?: 'block' | 'continue' | 'invert';
  label: string;
}

function MultiSliderInteractive({
  min,
  max,
  step,
  behavior,
  label,
}: MultiSliderInteractiveProps) {
  const [values, setValues] = useState<[number, number]>([min, max]);
  const display = `${label}: ${values[0].toFixed(1)} – ${values[1].toFixed(1)}`;
  return (
    <View style={{ padding: 16 }}>
      <MultiSlider
        label={display}
        range={[min, max]}
        step={step}
        behavior={behavior}
        values={values}
        onChange={setValues}
      />
    </View>
  );
}

const meta = {
  title: 'Components/MultiSlider',
  component: MultiSliderInteractive,
} satisfies Meta<typeof MultiSliderInteractive>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Difficulty: Story = {
  args: { min: 0, max: 6, step: 0.5, label: 'Difficulty' },
};

export const WithDuration: Story = {
  args: {
    min: 0,
    max: Duration.MULTIDAY,
    step: 10,
    label: 'Duration',
  },
};

export const Season: Story = {
  args: { min: 0, max: 23, step: 1, behavior: 'invert', label: 'Season' },
};

export const FullRange: Story = {
  args: { min: 0, max: 100, step: 5, label: 'Range' },
};
