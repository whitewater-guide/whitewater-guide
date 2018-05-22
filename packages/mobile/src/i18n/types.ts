import { i18n, TranslationFunction } from 'i18next';

export interface WithT {
  t: TranslationFunction;
  i18n?: i18n;
}
