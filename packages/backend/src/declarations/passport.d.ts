import { Profile } from 'passport';

declare module 'passport' {
  interface Profile {
    _json: {[key: string]: any};
  }
}
