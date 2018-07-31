import { Context } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import gqf from 'graphql-fields';
import { SectionRaw } from '../types';

const EMBEDDED_RIVER_FIELDS = ['__typename', 'id', 'name'];

const riverResolver: GraphQLFieldResolver<SectionRaw, Context> =
  ({ river_id, river_name }, _, { dataSources }, info) => {
    const tree = gqf(info);
    if (Object.keys(tree).every((name) => EMBEDDED_RIVER_FIELDS.includes(name))) {
      return {
        id: river_id,
        name: river_name,
      };
    }
    return dataSources.rivers.getById(river_id);
  };

export default riverResolver;
