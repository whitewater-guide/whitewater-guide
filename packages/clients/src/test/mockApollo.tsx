import { ApolloClient, ApolloProvider } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  BannerKind,
  BannerPlacement,
  MediaKind,
  TagCategory,
  typeDefs,
} from '@whitewater-guide/schema';
import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql';
import { JSONResolver } from 'graphql-scalars';
import React from 'react';

import { configureApolloCache } from '../apollo';

export interface QueryMap {
  [name: string]: (variables: any) => any;
}

export type MockedProviderStatic = React.FC & {
  client: ApolloClient<any> & { resetCounters: () => void };
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

export interface MockedResolversContext {
  counters: CounterMap;
}

export interface RecursiveMockResolver {
  [name: string]:
    | GraphQLFieldResolver<any, MockedResolversContext>
    | (() => RecursiveMockResolver);
}

export interface MockedProviderOptions {
  Query?: QueryMap;
  Mutation?: QueryMap;
  mocks?: RecursiveMockResolver;
}

const TAG_CATEGORIES = Object.values(TagCategory);

export const mockApolloClient = (
  options: MockedProviderOptions = {},
): ApolloClient<any> & { resetCounters: () => void } => {
  const { Query = {}, Mutation = {}, mocks = {} } = options;
  let schema = makeExecutableSchema({
    typeDefs,
    resolvers: { JSON: JSONResolver },
  });

  const primitiveMocks: RecursiveMockResolver = {
    ID: (_, __, { counters }, info) => {
      const { key, seq } = counters.resolveNext(info);
      return `${key}.${seq}`;
    },
    Int: (_, __, { counters }, info) => {
      const { seq } = counters.resolveNext(info);
      return seq;
    },
    Float: (_, __, { counters }, info) => {
      const { seq } = counters.resolveNext(info);
      return seq + 0.5;
    },
    String: (_, __, { counters }, info) => {
      const { key, seq } = counters.resolveNext(info);
      return `${key}.${seq}`;
    },
    Boolean: (_, __, { counters }, info) => {
      const { seq } = counters.resolveNext(info);
      return seq % 2 === 0;
    },
    MediaKind: (_, __, { counters }, info) => {
      const { seq } = counters.resolveNext(info);
      return [MediaKind.Photo, MediaKind.Video, MediaKind.Blog][seq % 3];
    },
    TagCategory: (_, __, { counters }, info) => {
      const { seq } = counters.resolveNext(info);
      return TAG_CATEGORIES[seq % TAG_CATEGORIES.length];
    },
    BannerPlacement: (_, __, { counters }, info) => {
      const { seq } = counters.resolveNext(info);
      const placements = Object.values(BannerPlacement);
      return placements[seq % placements.length];
    },
    BannerKind: (_, __, { counters }, info) => {
      const { seq } = counters.resolveNext(info);
      const bannerKinds = Object.values(BannerKind);
      return bannerKinds[seq % bannerKinds.length];
    },
    JSON: (_, __, { counters }, info) => {
      const { key, seq } = counters.resolveNext(info);
      return { json: `${key}.${seq}` };
    },
    Date: (_, __, { counters }, info) => {
      const { seq } = counters.resolveNext(info);
      const result = new Date(2017, 1, 1);
      result.setDate(result.getDate() + seq);
      return result;
    },
    DateTime: (_, __, { counters }, info) => {
      const { seq } = counters.resolveNext(info);
      const result = new Date(2017, 1, 1);
      result.setDate(result.getDate() + seq);
      return result;
    },
    Coordinates: (_, __, { counters }, info) => {
      const { seq } = counters.resolveNext(info);
      return [seq, seq + 1, seq + 2];
    },
  };

  schema = addMocksToSchema({
    schema,
    mocks: {
      ...primitiveMocks,
      ...mocks,
      Query: () => Query,
      Mutation: () => Mutation,
    },
  });

  const countersMap = new CounterMap();
  return Object.assign(
    new ApolloClient({
      cache: configureApolloCache(),
      link: new SchemaLink({ schema, context: { counters: countersMap } }),
    }),
    {
      resetCounters() {
        countersMap.clear();
      },
    },
  );
};

export const mockApolloProvider = (
  options: MockedProviderOptions = {},
): MockedProviderStatic => {
  const client = mockApolloClient(options);

  const MP: React.FC = ({ children }) => (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  );

  return Object.assign(MP, { client });
};
