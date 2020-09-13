import formatDateFNS from 'date-fns/format';

import { __DATE_FNS_LOCALE__ } from './configDateFNS';

export const formatDate = (date: Date, format: string) =>
  formatDateFNS(date, format, { locale: __DATE_FNS_LOCALE__ });
