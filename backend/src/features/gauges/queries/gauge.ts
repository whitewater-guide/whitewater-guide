import { GraphQLResolveInfo } from 'graphql';
import { baseResolver, Context } from '../../../apollo';
import db from '../../../db';
import { buildQuery } from '../queryBuilder';

interface GaugeQuery {
  id: string;
  language?: string;
}

const gauge = baseResolver.createResolver(
  (root, { id, language }: GaugeQuery, context: Context, info: GraphQLResolveInfo) => {
    const query = buildQuery(db(), info, context, id, language);
    return query.first();
  },
);

export default gauge;
