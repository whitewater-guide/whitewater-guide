import { LANGUAGES } from '@whitewater-guide/schema';
import Negotiator from 'negotiator';

export function negotiateLanguage(req: any, socialLocales: string[]): string {
  // 'Accept-Language' header is the last resort
  const negotiator = new Negotiator(req);
  const languages = [
    ...socialLocales,
    ...negotiator.languages(LANGUAGES),
    'en',
  ];
  // Explicit language passed as param is a first choice
  return req?.query?.language || languages[0];
}
