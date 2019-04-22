import { Middleware } from 'koa';
import { KoaPassport as OriginalKoaPassport } from 'koa-passport';

export class KoaPassport extends OriginalKoaPassport {}

export type MiddlewareFactory = (passport: KoaPassport) => Middleware<any, any>;
