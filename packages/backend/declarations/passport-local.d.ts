import 'passport-local';

declare module 'passport-local' {
  interface IVerifyOptions {
    payload?: { [key: string]: any };
  }
}
