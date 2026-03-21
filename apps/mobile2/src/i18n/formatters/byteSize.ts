import type { FormatFunction } from 'i18next';
import prettyBytes from 'pretty-bytes';

const byteSize: FormatFunction = (value, _format, lng) =>
  Number(value) ? prettyBytes(Number(value), { locale: lng }) : '';

export default byteSize;
