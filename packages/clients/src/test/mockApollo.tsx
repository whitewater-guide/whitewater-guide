import {
  BannerKind,
  BannerPlacement,
  HarvestMode,
  MediaKind,
  TAG_CATEGORIES,
} from '@whitewater-guide/commons';
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

export const mockApolloClient = (
  options: MockedProviderOptions = {},
): ApolloClient<any> => {
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
    HarvestMode: (_, __, { counters }, info) => {
      const { seq } = counters.resolveNext(info);
      return [HarvestMode.ONE_BY_ONE, HarvestMode.ALL_AT_ONCE][seq % 2];
    },
    MediaKind: (_, __, { counters }, info) => {
      const { seq } = counters.resolveNext(info);
      return [MediaKind.photo, MediaKind.video, MediaKind.blog][seq % 3];
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
  };

  addMockFunctionsToSchema({
    schema,
    mocks: {
      ...primitiveMocks,
      ...mocks,
      Query: () => Query,
      Mutation: () => Mutation,
    },
  });

  return new ApolloClient({
    cache: configureApolloCache(),
    link: new SchemaLink({ schema, context: { counters: new CounterMap() } }),
  });
};

export const mockApolloProvider = (
  options: MockedProviderOptions = {},
): MockedProviderStatic => {
  const client = mockApolloClient(options);

  const MP: React.FC = ({ children }) => (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  );

  // tslint:disable-next-line:prefer-object-spread
  return Object.assign(MP, { client });
};
