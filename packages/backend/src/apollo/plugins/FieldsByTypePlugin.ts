import { GraphQLSchema, parse } from 'graphql';

import { copyFieldsByType } from './copyFieldsByType';
import { fieldsByType } from './fieldsByType';
import { FieldsByType } from './types';

/**
 * This plugin taps into query execution and sets fieldsByType on context
 * Uses cache internally
 */
export class FieldsByTypePlugin {
  private _cache: Map<string, FieldsByType> = new Map();

  constructor(private readonly _schema: GraphQLSchema) {}

  requestDidStart(ctx: any) {
    return this as any;
  }

  didResolveOperation = (requestContext: any) => {
    const {
      document,
      request,
      context,
      queryHash,
      operationName,
    } = requestContext;
    if (operationName === 'IntrospectionQuery') {
      return Promise.resolve();
    }
    if (queryHash) {
      const cached = this._cache.get(queryHash);
      if (cached) {
        copyFieldsByType(cached, context.fieldsByType);
        return Promise.resolve();
      }
    }
    if (!document && !request.query) {
      return Promise.resolve();
    }
    const doc = requestContext.document || parse(request.query!);
    const acc = fieldsByType(doc, this._schema);
    if (queryHash) {
      this._cache.set(queryHash, acc);
    }

    // We copy here, because context.fieldsByType is passed
    // by reference to dataSources before this is called
    copyFieldsByType(acc, context.fieldsByType);
    return Promise.resolve();
  };
}
