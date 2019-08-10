import { __DATE_FNS_LOCALE__ } from './configDateFNS';

export const getMonthName = (month: number, formatting = true) => {
  if (month < 0 || month > 11) {
    throw new Error('incorrect month number: ' + month);
  }
  return __DATE_FNS_LOCALE__.localize.month(
    month,
    formatting ? { context: 'formatting' } : undefined,
  );
};
