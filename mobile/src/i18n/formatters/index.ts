import { FormatFunction } from 'i18next';

import brackets from './brackets';
import byteSize from './byteSize';
import month from './month';

const formatters: Record<string, FormatFunction> = {
  month,
  byteSize,
  brackets,
};

export default formatters;
