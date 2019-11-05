import bs from 'byte-size';
import { FormatFunction } from 'i18next';
import toNumber from 'lodash/toNumber';

const byteSize: FormatFunction = (value) =>
  toNumber(value) ? bs(toNumber(value)) : '';

export default byteSize;
