import { LANGUAGES } from '@whitewater-guide/schema';

const ALLOWED = new Set(LANGUAGES);
const regex = /((([a-zA-Z]+(-[a-zA-Z0-9]+){0,2})|\*)(;q=[0-1](\.[0-9]+)?)?)*/g;

/**
 * returns 2-letter codes of accepted languages from header, sorted by q
 * can contain duplicates
 * @param al
 * @returns
 */
function parse(al?: string): string[] {
  if (!al) {
    return [];
  }
  const strings = al.match(regex);

  if (strings === null) {
    return [];
  }

  // not very effective, but whatever
  return strings
    .map((m) => {
      if (m.length === 0) {
        return { code: '*', q: 1 };
      }
      const bits = m.split(';');
      const code = bits[0].split('-')[0];
      return {
        code,
        q:
          typeof bits[1] === 'string' && bits[1].length
            ? parseFloat(bits[1].split('=')[1])
            : 1.0,
      };
    })
    .sort((a, b) => b.q - a.q)
    .filter((i) => i.code !== '*')
    .map((i) => i.code);
}

/**
 * picks most preferred from allowed, if none of preferred are allowed, return undefined
 * @param preferred sorted array of 2-letter language codes
 * @param allowed set of 2-letter language codes
 * @returns
 */
function pick(preferred: string[], allowed: Set<string>): string | undefined {
  for (const l of preferred) {
    if (allowed.has(l)) {
      return l;
    }
  }
  return undefined;
}

export function negotiateLanguage(req: any, socialLocale?: string): string {
  // Explicit language passed as param is a first choice
  // Locale from social network = second choice
  let explicit: string | undefined =
    req?.body?.language ?? req?.query?.language ?? socialLocale;
  // Use fake content-negotiation to determine best language for user based on facebook locale
  // Accept-language uses dashes, facebook uses underscore
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
  // https://developers.facebook.com/docs/internationalization/#locales
  // Make sure that it it is always defined
  if (explicit && typeof explicit === 'string') {
    explicit = pick([explicit.slice(0, 2)], ALLOWED);
    if (explicit) {
      return explicit;
    }
  }
  // 'Accept-Language' header is the last resort
  const headerLangs = parse(req?.headers['accept-language']);
  const headerLang = pick(headerLangs, ALLOWED);
  if (headerLang) {
    return headerLang;
  }
  // default to english
  return 'en';
}
