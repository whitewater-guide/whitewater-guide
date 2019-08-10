import { getMonthName } from '@whitewater-guide/clients';
import i18next from 'i18next';

const month: i18next.FormatFunction = (value) => getMonthName(value);

export default month;
