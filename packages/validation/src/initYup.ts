import { setLocale } from 'yup';

import { yupLocale } from './yupLocale';

export const initYup = (): void => {
  setLocale(yupLocale);
};
