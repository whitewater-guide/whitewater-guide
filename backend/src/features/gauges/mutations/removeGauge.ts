import { GraphQLFieldResolver } from 'graphql';
import { isAdminResolver } from '../../../apollo';
import db from '../../../db';

interface RemoveVariables {
  id: string;
}

export const removeGaugeQuery = ({ id }: RemoveVariables) =>
  db().table('gauges').del().where({ id }).returning('id');

const resolver: GraphQLFieldResolver<any, any> = (root, args: RemoveVariables) =>
  removeGaugeQuery(args);

const removeGauge = isAdminResolver.createResolver(
  resolver,
);

export default removeGauge;
