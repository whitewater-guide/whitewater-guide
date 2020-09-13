import { GraphQLFieldResolver } from 'graphql';

import { Context } from '~/apollo';

import { SectionRaw } from '../types';

const shapeResolver: GraphQLFieldResolver<SectionRaw, Context> = ({ shape }) =>
  shape.coordinates;

export default shapeResolver;
