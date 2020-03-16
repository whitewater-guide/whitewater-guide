import { TFunction } from 'i18next';

export const translateError = (t: TFunction, error: any) => {
  return error
    ? typeof error === 'string'
      ? t(error)
      : t((error as any).key, (error as any).options)
    : undefined;
};
