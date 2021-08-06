import { FormatFunction } from 'i18next';
import toNumber from 'lodash/toNumber';
import prettyBytes from 'pretty-bytes';

const byteSize: FormatFunction = (value, _format, lng) =>
  toNumber(value) ? prettyBytes(toNumber(value), { locale: lng }) : '';

export default byteSize;
