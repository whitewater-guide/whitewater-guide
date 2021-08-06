/* eslint-disable import/no-duplicates */
import { LANGUAGES } from '@whitewater-guide/schema';
import de from 'date-fns/locale/de';
import en from 'date-fns/locale/en-US';
import es from 'date-fns/locale/es';
import fr from 'date-fns/locale/fr';
import it from 'date-fns/locale/it';
import pt from 'date-fns/locale/pt';
import ru from 'date-fns/locale/ru';

const locales: Record<string, Locale> = {
  en,
  ru,
  es,
  de,
  fr,
  pt,
  it,
};

// eslint-disable-next-line @typescript-eslint/naming-convention, import/no-mutable-exports
export let __DATE_FNS_LOCALE__: Locale = en;

export const configDateFNS = (language: string) => {
  if (LANGUAGES.indexOf(language) === -1) {
    throw new Error(`unknown date-fns language: ${language}`);
  }
  __DATE_FNS_LOCALE__ = locales[language];
};
