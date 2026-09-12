import type { GaugeBindingValues } from './types';

const COLOR_STRINGS = {
  minimum: '#0000FF',
  optimum: '#00FF00',
  maximum: '#FF0000',
  impossible: '#990000',
} as const;

export function getColorForValue(
  value: number,
  binding: GaugeBindingValues | undefined | null,
  defaultColor: string,
): string {
  if (!binding) {
    return defaultColor;
  }
  const { minimum, maximum, optimum, impossible } = binding;
  if (value === minimum) {
    return COLOR_STRINGS.minimum;
  }
  if (value === optimum) {
    return COLOR_STRINGS.optimum;
  }
  if (value === maximum) {
    return COLOR_STRINGS.maximum;
  }
  if (value === impossible) {
    return COLOR_STRINGS.impossible;
  }
  return defaultColor;
}
