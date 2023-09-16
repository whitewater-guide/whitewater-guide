import type {
  ApolloServerPlugin,
  GraphQLRequestContextDidResolveOperation,
  GraphQLRequestListener,
} from '@apollo/server';
import type { GraphQLSchema } from 'graphql';
import { parse } from 'graphql';

import type { Context } from '../context';
import { copyFieldsByType } from './copyFieldsByType';
import { fieldsByType } from './fieldsByType';
import type { FieldsByType } from './types';

/**
 * This plugin taps into query execution and sets fieldsByType on context
 * Uses cache internally
 */
export class FieldsByTypePlugin
  implements ApolloServerPlugin<Context>, GraphQLRequestListener<Context>
{
  private _cache: Map<string, FieldsByType> = new Map();
  private readonly _schema: GraphQLSchema;

  constructor(schema: GraphQLSchema) {
    this._schema = schema;
  }

  requestDidStart?(): Promise<GraphQLRequestListener<Context>> {
    return Promise.resolve(this);
  }

  didResolveOperation = (
    requestContext: GraphQLRequestContextDidResolveOperation<Context>,
  ) => {
    const { document, request, contextValue, queryHash, operationName } =
      requestContext;
    if (operationName === 'IntrospectionQuery') {
      return Promise.resolve();
    }
    if (queryHash) {
      const cached = this._cache.get(queryHash);
      if (cached) {
        copyFieldsByType(cached, contextValue.fieldsByType);
        return Promise.resolve();
      }
    }
    if (!document && !request.query) {
      return Promise.resolve();
    }
    const doc = document ?? parse(request.query!);
    const acc = fieldsByType(doc, this._schema);
    if (queryHash) {
      this._cache.set(queryHash, acc);
    }

    // We copy here, because context.fieldsByType is passed
    // by reference to dataSources before this is called
    copyFieldsByType(acc, contextValue.fieldsByType);
    return Promise.resolve();
  };
}
