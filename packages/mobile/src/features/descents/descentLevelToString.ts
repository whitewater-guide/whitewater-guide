import { DescentLevel } from '@whitewater-guide/commons';

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
