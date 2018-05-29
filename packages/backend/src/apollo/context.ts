import * as koa from 'koa';
import { get } from 'lodash';
import { LastMeasurementLoader } from '../features/measurements/data-loader';
import { PurchasesLoader } from '../features/purchases/data-loader';
import { LANGUAGES } from '../ww-commons';

export interface ContextUser {
  id: string;
  admin: boolean;
  [key: string]: any;
}

export interface Context {
  language: string;
  user?: ContextUser;
  lastMeasurementLoader: LastMeasurementLoader;
  purchasesLoader: PurchasesLoader;
}

export const newContext = (ctx: Partial<koa.Context>): Context => {
  const user: ContextUser | undefined = ctx.state && ctx.state.user;
  const language = ctx.headers['x-editor-language'] ||
    get(user, 'language') ||
    ctx.acceptsLanguages!(LANGUAGES) ||
    'en';
  // Side-effect. Set response content-language
  ctx.set!('Content-Language', language);
  return {
    user,
    language,
    lastMeasurementLoader: new LastMeasurementLoader(),
    purchasesLoader: new PurchasesLoader(user, language),
  };
};
