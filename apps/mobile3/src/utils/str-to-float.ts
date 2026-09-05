const SEPARATOR = (0.5).toString()[1];
const OTHER_SEPARATOR = SEPARATOR === ',' ? /\./ : /,/;

/**
 * Locale semi-agnostic string to float conversion.
 * Accepts either "," or "." as the decimal separator.
 */
export function strToFloat(value?: string | number | null): number {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value !== 'string') {
    return NaN;
  }
  const safeStr = value.replace(OTHER_SEPARATOR, SEPARATOR);
  return parseFloat(safeStr);
}
