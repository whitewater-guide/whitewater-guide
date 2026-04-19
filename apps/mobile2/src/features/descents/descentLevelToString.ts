import type { DescentLevel } from '@whitewater-guide/schema';

export default function descentLevelToString(
  level?: DescentLevel | null,
): string {
  if (!level) {
    return '';
  }
  const { unit, value } = level;
  if (value === null || value === undefined) {
    return '';
  }
  return unit ? `${value} ${unit}` : value.toString(10);
}
