import i18next from 'i18next';
import brackets from './brackets';
import byteSize from './byteSize';
import month from './month';

const formatters: Record<string, i18next.FormatFunction> = {
  month,
  byteSize,
  brackets,
};

export default formatters;
