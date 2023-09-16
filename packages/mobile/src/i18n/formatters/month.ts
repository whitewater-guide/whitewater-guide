import { getMonthName } from '@whitewater-guide/clients';
import type { FormatFunction } from 'i18next';

const month: FormatFunction = (value) => getMonthName(value);

export default month;
