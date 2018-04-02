import * as koa from 'koa';
import { get } from 'lodash';
import { LastMeasurementLoader } from '../features/measurements/data-loader';

export interface ContextUser {
  id: string;
  role: number;
  [key: string]: any;
}

export interface Context {
  language: string;
  user?: ContextUser;
  lastMeasurementLoader: LastMeasurementLoader;
}

export const newContext = (ctx: koa.Context): Context => {
  const user: ContextUser | undefined = ctx.state.user;
  const language = get(user, 'editor_settings.language') ||
    get(user, 'language') ||
    ctx.acceptsLanguages(['en', 'ru', 'es', 'de', 'fr', 'pt', 'it']) ||
    'en';
  // Side-effect. Set response content-language
  ctx.set('Content-Language', language);
  return {
    user,
    language,
    lastMeasurementLoader: new LastMeasurementLoader(),
  };
};