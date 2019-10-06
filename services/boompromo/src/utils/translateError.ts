import i18next from 'i18next';

export const translateError = (t: i18next.TFunction, error: any) => {
  return error
    ? typeof error === 'string'
      ? t(error)
      : t((error as any).key, (error as any).options)
    : undefined;
};
