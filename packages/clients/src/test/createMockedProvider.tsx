import { HarvestMode, TAG_CATEGORIES } from '@whitewater-guide/commons';
import { ApolloClient } from 'apollo-client';
import { SchemaLink } from 'apollo-link-schema';
import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import GraphQLJSON from 'graphql-type-json';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { configureApolloCache } from '../apollo';

export interface QueryMap {
  [name: string]: (variables: any) => any;
}

export type MockedProviderStatic = React.SFC & {
  client: ApolloClient<any>;
};

class CounterMap extends Map<string, number> {
  getNext(key: string): number {
    const current = this.get(key);
    const next = (current || 0) + 1;
    this.set(key, next);
    return next;
  }

  resolveNext(info: GraphQLResolveInfo) {
    const {
      fieldName,
      parentType: { name: parentName },
    } = info;
    const key = `${parentName}.${fieldName}`;
    const seq = this.getNext(key);
    return { key, seq };
  }
}

export interface MockedProviderOptions {
  Query?: QueryMap;
  Mutation?: QueryMap;
  mocks?: {
    [name: string]: GraphQLFieldResolver<any, any>;
  };
}

export const createMockedProvider = (
  options: MockedProviderOptions = {},
): MockedProviderStatic => {
  const { Query = {}, Mutation = {}, mocks = {} } = options;
  let typeDefs: any = [];
  try {
    // set global.__GRAPHQL_TYPEDEFS_MODULE__ in jest's setupTests file
    // @ts-ignore
    const typedefsModule = global.__GRAPHQL_TYPEDEFS_MODULE__;
    typeDefs = typedefsModule.default;
  } catch {
    throw new Error('Please run clients.pretest to load typedefs');
  }
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: { JSON: GraphQLJSON },
  });

  const counters = new CounterMap();

  addMockFunctionsToSchema({
    schema,
    mocks: {
      ID: (_, __, ___, info) => {
        const { key, seq } = counters.resolveNext(info);
        return `${key}.${seq}`;
      },
      Int: (_, __, ___, info) => {
        const { seq } = counters.resolveNext(info);
        return seq;
      },
      Float: (_, __, ___, info) => {
        const { seq } = counters.resolveNext(info);
        return seq + 0.5;
      },
      String: (_, __, ___, info) => {
        const { key, seq } = counters.resolveNext(info);
        return `${key}.${seq}`;
      },
      Boolean: (_, __, ___, info) => {
        const { seq } = counters.resolveNext(info);
        return seq % 2 === 0;
      },
      HarvestMode: (_, __, ___, info) => {
        const { seq } = counters.resolveNext(info);
        return [HarvestMode.ONE_BY_ONE, HarvestMode.ALL_AT_ONCE][seq % 2];
      },
      TagCategory: (_, __, ___, info) => {
        const { seq } = counters.resolveNext(info);
        return TAG_CATEGORIES[seq % TAG_CATEGORIES.length];
      },
      JSON: (_, __, ___, info) => {
        const { key, seq } = counters.resolveNext(info);
        return { json: `${key}.${seq}` };
      },
      Date: (_, __, ___, info) => {
        const { seq } = counters.resolveNext(info);
        const result = new Date(2017, 1, 1);
        result.setDate(result.getDate() + seq);
        return result;
      },
      ...mocks,
      Query: () => Query,
      Mutation: () => Mutation,
    },
  });

  const client = new ApolloClient({
    cache: configureApolloCache(),
    link: new SchemaLink({ schema }),
  });

  const MP: React.SFC = ({ children }) => (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  );

  // tslint:disable-next-line:prefer-object-spread
  return Object.assign(MP, { client });
};
