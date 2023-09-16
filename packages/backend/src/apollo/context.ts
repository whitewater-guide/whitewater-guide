import type { ContextFunction } from '@apollo/server';
import type { KoaContextFunctionArgument } from '@as-integrations/koa';
import { LANGUAGES } from '@whitewater-guide/schema';
import type Koa from 'koa';

import type { Connectors } from '../db/connectors/index';
import { createConnectors } from '../db/connectors/index';

interface KoaState {
  user: ContextUser;
}

export interface ContextUser {
  id: string;
  admin: boolean;
  language: string;
  verified: boolean;
}

// Context is a class, so connectors can access context
export class Context {
  public readonly language: string;
  public readonly user?: ContextUser;
  // This information is required for query resolution
  // For each GraphQLObjectType from query AST this map stores set of it's field names
  public readonly fieldsByType: Map<string, Set<string>> = new Map();
  public readonly dataSources: Connectors;

  constructor(language = 'en', user?: ContextUser) {
    this.language = language;
    this.user = user;
    this.dataSources = createConnectors(this);
  }
}

export const koaContext: ContextFunction<
  [KoaContextFunctionArgument<KoaState, Context>],
  Context
> = async ({ ctx }) => {
  const user: Koa.ContextUser | undefined = (ctx.state as any)?.user;
  const language =
    (ctx.headers?.['x-editor-language'] as string) ||
    user?.language ||
    ctx.acceptsLanguages?.(LANGUAGES) ||
    'en';

  // Side-effect. Set response content-language
  ctx.set?.('Content-Language', language);

  return new Context(language, user);
};
