import { Connectors } from '@db/connectors';
import { LANGUAGES } from '@whitewater-guide/commons';
import * as koa from 'koa';
import get from 'lodash/get';
import { Omit } from 'type-zoo';

export interface ContextUser {
  id: string;
  admin: boolean;
  [key: string]: any;
}

export interface Context {
  readonly language: string;
  readonly user?: ContextUser;
  // This information is required for query resolution
  // For each GraphQLObjectType from query AST this map stores set of it's field names
  readonly fieldsByType: Map<string, Set<string>>;
  // Indicates legacy request
  readonly legacy?: number;
  dataSources: Connectors;
}

interface Ctx {
  ctx: Partial<koa.Context>;
}

export const newContext = (
  { ctx }: Ctx,
  fixedLanguage?: string,
): Omit<Context, 'dataSources'> => {
  const user: ContextUser | undefined = ctx.state && ctx.state.user;
  const language =
    fixedLanguage ||
    ctx.headers['x-editor-language'] ||
    get(user, 'language') ||
    ctx.acceptsLanguages!(LANGUAGES) ||
    'en';

  // Side-effect. Set response content-language
  ctx.set!('Content-Language', language);

  // 1: requests redirected from uris before subdomains were introduced
  let legacy: number | undefined;
  if (ctx.headers['x-legacy-redirect']) {
    legacy = parseInt(ctx.headers['x-legacy-redirect'], 10);
  }

  const fieldsByType = new Map<string, Set<string>>();
  // dataSources are not optional, but they're added later
  return { user, language, fieldsByType, legacy };
};
