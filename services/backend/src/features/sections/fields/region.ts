import { Context } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import gqf from 'graphql-fields';
import { SectionRaw } from '../types';

const EMBEDDED_REGION_FIELDS = ['__typename', 'id', 'name'];

const regionResolver: GraphQLFieldResolver<SectionRaw, Context> = (
  { region_id, region_name },
  _,
  { dataSources },
  info,
) => {
  const tree = gqf(info);
  if (
    region_name &&
    Object.keys(tree).every((name) => EMBEDDED_REGION_FIELDS.includes(name))
  ) {
    return {
      id: region_id,
      name: region_name,
    };
  }
  return dataSources.regions.getById(region_id);
};

export default regionResolver;
