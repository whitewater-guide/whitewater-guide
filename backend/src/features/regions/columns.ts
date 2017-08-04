import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../../apollo';
import db from '../../db';
import { Region } from './types';
import graphqlFields = require('graphql-fields');

export type ResponseFields = keyof Region;

type FieldMap = {
  [field in keyof Region]?: (context: Context) => any;
};

const map: FieldMap = {
  bounds: () => db().raw('ST_AsText(bounds) AS bounds'),
  createdAt: () => 'created_at',
  updatedAt: () => 'updated_at',
  seasonNumeric: () => 'season_numeric',
};

export const getColumns = (info: GraphQLResolveInfo, context: Context): any[] => {
  const fields: ResponseFields[] = Object.keys(graphqlFields(info)) as any;
  return fields.map(field => map[field] ? map[field]!(context) : field );
};
