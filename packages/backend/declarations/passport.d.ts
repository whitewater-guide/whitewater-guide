import 'passport';

declare module 'passport' {
  interface Profile {
    locale?: string;
    _json: { [key: string]: any };
  }
}
