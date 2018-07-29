import { createModels, Models } from '@db/model';
import { LastMeasurementLoader } from '@features/measurements/data-loader';
import { PurchasesLoader } from '@features/purchases/data-loader';
import { LANGUAGES } from '@ww-commons';
import * as koa from 'koa';
import { get } from 'lodash';

export interface ContextUser {
  id: string;
  admin: boolean;
  [key: string]: any;
}

export interface Context {
  readonly language: string;
  readonly user?: ContextUser;
  readonly lastMeasurementLoader: LastMeasurementLoader;
  readonly purchasesLoader: PurchasesLoader;
  readonly fieldsByType: Map<string, Set<string>>;
  readonly models: Models;
}

export const newContext = (ctx: Partial<koa.Context>, fixedLanguage?: string): Context => {
  const user: ContextUser | undefined = ctx.state && ctx.state.user;
  const language = fixedLanguage ||
    ctx.headers['x-editor-language'] ||
    get(user, 'language') ||
    ctx.acceptsLanguages!(LANGUAGES) ||
    'en';

  // Side-effect. Set response content-language
  ctx.set!('Content-Language', language);

  const fieldsByType = new Map<string, Set<string>>();
  return {
    user,
    language,
    lastMeasurementLoader: new LastMeasurementLoader(),
    purchasesLoader: new PurchasesLoader(user, language),
    fieldsByType,
    models: createModels(user, language, fieldsByType),
  };
};
