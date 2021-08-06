import { TFunction } from 'i18next';

export const translateError = (t: TFunction, error: any) =>
  error
    ? typeof error === 'string'
      ? t(error)
      : t(error.key, error.options)
    : undefined;
