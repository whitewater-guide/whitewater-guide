import type { Sql } from '../db/index';
import type { TimestampedResolvers } from './resolvers.generated';

export const timestampedResolvers: Omit<TimestampedResolvers, '__resolveType'> =
  {
    createdAt: (node: Sql.Timestamped) =>
      new Date(node.created_at).toISOString(),
    updatedAt: (node: Sql.Timestamped) =>
      new Date(node.updated_at).toISOString(),
  };
