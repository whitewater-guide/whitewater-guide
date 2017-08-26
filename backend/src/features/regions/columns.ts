import { GraphQLResolveInfo } from 'graphql';
import { compact } from 'lodash';
import { Context } from '../../apollo';
import db from '../../db';
import { Region } from '../../ww-commons';
import graphqlFields = require('graphql-fields');

export type ResponseFields = keyof Region;

type FieldMap = {
  [field in keyof Region]?: (context: Context) => any;
};

const map: FieldMap = {
  // fields with double underscore work only in ts 2.5+
  __typename: () => null,
  bounds: () => db().raw('ST_AsText(bounds) AS bounds'),
  createdAt: () => 'created_at',
  updatedAt: () => 'updated_at',
  seasonNumeric: () => 'season_numeric',
  riversCount: () => null,
  sectionsCount: () => null,
};

export const getColumns = (info: GraphQLResolveInfo, context: Context): any[] => {
  const fields: ResponseFields[] = Object.keys(graphqlFields(info)) as any;
  return compact(fields.map(field => map[field] ? map[field]!(context) : field));
};
