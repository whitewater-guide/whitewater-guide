import { Connectors } from '@db/connectors';
import { LANGUAGES } from '@whitewater-guide/commons';
import * as koa from 'koa';
import get from 'lodash/get';

export interface ContextUser {
  id: string;
  admin: boolean;
  [key: string]: any;
}

export interface Context {
  readonly language: string;
  readonly user?: ContextUser;
  readonly fieldsByType: Map<string, Set<string>>;
  dataSources: Connectors;
}

interface Ctx {
  ctx: Partial<koa.Context>;
}

export const newContext = ({ ctx }: Ctx, fixedLanguage?: string): Context => {
  const user: ContextUser | undefined = ctx.state && ctx.state.user;
  const language =
    fixedLanguage ||
    ctx.headers['x-editor-language'] ||
    get(user, 'language') ||
    ctx.acceptsLanguages!(LANGUAGES) ||
    'en';

  // Side-effect. Set response content-language
  ctx.set!('Content-Language', language);

  const fieldsByType = new Map<string, Set<string>>();
  // Ignore, becuase dataSources are not optional, but they're added later
  // @ts-ignore
  return { user, language, fieldsByType };
};
