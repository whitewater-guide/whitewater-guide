import { LANGUAGES } from '@whitewater-guide/commons';
import * as koa from 'koa';
import get from 'lodash/get';

import { Connectors } from '~/db/connectors';

export interface ContextUser {
  id: string;
  admin: boolean;
  language: string;
  verified: boolean;
}

export interface Context {
  readonly language: string;
  readonly user?: ContextUser;
  // This information is required for query resolution
  // For each GraphQLObjectType from query AST this map stores set of it's field names
  readonly fieldsByType: Map<string, Set<string>>;
  dataSources: Connectors;
}

interface Ctx {
  ctx: Partial<koa.Context>;
}

export const newContext = ({ ctx }: Ctx): Omit<Context, 'dataSources'> => {
  const user: koa.ContextUser | undefined = ctx.state && ctx.state.user;
  const language =
    ctx.headers['x-editor-language'] ||
    get(user, 'language') ||
    ctx.acceptsLanguages!(LANGUAGES) ||
    'en';

  // Side-effect. Set response content-language
  ctx.set!('Content-Language', language);

  const fieldsByType = new Map<string, Set<string>>();
  // dataSources are not optional, but they're added later
  return { user, language, fieldsByType };
};
