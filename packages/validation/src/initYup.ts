import * as yup from 'yup';

import { yupLocale } from './yupLocale';

export const initYup = (): void => {
  yup.setLocale(yupLocale);
};
