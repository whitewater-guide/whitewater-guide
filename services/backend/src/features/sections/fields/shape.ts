import { Context } from '~/apollo';
import { GraphQLFieldResolver } from 'graphql';
import { SectionRaw } from '../types';

const shapeResolver: GraphQLFieldResolver<SectionRaw, Context> = ({ shape }) =>
  shape.coordinates;

export default shapeResolver;
