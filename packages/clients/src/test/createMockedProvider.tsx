import { ApolloClient } from 'apollo-client';
import { SchemaLink } from 'apollo-link-schema';
import { GraphQLResolveInfo } from 'graphql';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import GraphQLJSON from 'graphql-type-json';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { HarvestMode, TAG_CATEGORIES } from '../../ww-commons';
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
    const { fieldName, parentType: { name: parentName } } = info;
    const key = `${parentName}.${fieldName}`;
    const seq = this.getNext(key);
    return { key, seq };
  }
}

export const createMockedProvider = (queries: QueryMap = {}, mutations: QueryMap = {}): MockedProviderStatic => {
  let typeDefs: any = [];
  try {
    typeDefs = require('./typedefs').default;
  } catch {
    console.error('Please run clients.pretest to load typedefs');
  }
  const schema = makeExecutableSchema({ typeDefs, resolvers: { JSON: GraphQLJSON } });

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
        return  { json: `${key}.${seq}` };
      },
      Date: (_, __, ___, info) => {
        const { seq } = counters.resolveNext(info);
        const result = new Date(2017, 1, 1);
        result.setDate(result.getDate() + seq);
        return result;
      },
      Query: () => queries,
      Mutation: () => mutations,
    },
  });

  const client = new ApolloClient({
    cache: configureApolloCache(),
    link: new SchemaLink({ schema }),
  });

  const MP: React.SFC = ({ children }) => (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );

  // tslint:disable-next-line:prefer-object-spread
  return Object.assign(MP, { client });
};
