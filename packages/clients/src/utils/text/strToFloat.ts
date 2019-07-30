const SEPARATOR = (0.5).toString()[1];
const OTHER_SEPARATOR = SEPARATOR === ',' ? /\./ : /,/;

/**
 * locale semi-agnostic string to float conversion
 * @param value String with either "," or "." as decimal separator
 * @returns Number
 */
export function strToFloat(value?: any): number {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value !== 'string') {
    return NaN;
  }
  const safeStr = value.replace(OTHER_SEPARATOR, SEPARATOR);
  return parseFloat(safeStr);
}
