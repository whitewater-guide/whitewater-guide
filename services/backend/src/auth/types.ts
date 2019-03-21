import { Middleware } from 'koa';
import { KoaPassport as OriginalKoaPassport } from 'koa-passport';

export interface SignInResponseBody {
  success: boolean;
  error?: string;
  // user id
  id?: string;
  // for mobile clients
  accessToken?: string;
  // for mobile clients
  refreshToken?: string;
}

export class KoaPassport extends OriginalKoaPassport {}

export type MiddlewareFactory = (passport: KoaPassport) => Middleware<any, any>;
