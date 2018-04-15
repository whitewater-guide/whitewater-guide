import * as koa from 'koa';
import { get } from 'lodash';
import { LANGUAGES } from '../config';
import { LastMeasurementLoader } from '../features/measurements/data-loader';

export interface ContextUser {
  id: string;
  admin: boolean;
  [key: string]: any;
}

export interface Context {
  language: string;
  user?: ContextUser;
  lastMeasurementLoader: LastMeasurementLoader;
}

export const newContext = (ctx: Partial<koa.Context>): Context => {
  const user: ContextUser | undefined = ctx.state && ctx.state.user;
  const language = get(user, 'editor_settings.language') ||
    get(user, 'language') ||
    ctx.acceptsLanguages!(LANGUAGES) ||
    'en';
  // Side-effect. Set response content-language
  ctx.set!('Content-Language', language);
  return {
    user,
    language,
    lastMeasurementLoader: new LastMeasurementLoader(),
  };
};
