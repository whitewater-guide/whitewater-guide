import { GraphQLFieldResolver } from 'graphql';

const gauges: GraphQLFieldResolver<any, any> = (root, args, context) => {
  return [];
};

const gauge: GraphQLFieldResolver<any, any> = (root, args, context) => {
  return null;
};

const countGauges: GraphQLFieldResolver<any, any> = (root, args, context) => {
  return 0;
};

export const gaugesResolvers = {
  Query: {
    gauges,
    gauge,
    countGauges,
  },
};
