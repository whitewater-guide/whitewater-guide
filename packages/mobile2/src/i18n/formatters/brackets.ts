import type { FormatFunction } from 'i18next';

const brackets: FormatFunction = (value) => {
  const trimmed = value ? value.toString().trim() : value;
  return trimmed ? `(${value})` : '';
};

export default brackets;
