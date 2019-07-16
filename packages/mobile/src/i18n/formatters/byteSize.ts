import bs from 'byte-size';
import i18next from 'i18next';
import toNumber from 'lodash/toNumber';

const byteSize: i18next.FormatFunction = (value) =>
  toNumber(value) ? bs(toNumber(value)) : '';

export default byteSize;
