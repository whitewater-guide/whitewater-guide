import { DescentResolvers, timestampedResolvers } from '~/apollo';
import { Sql } from '~/db';

import section from './section';

const descentFieldResolvers: DescentResolvers = {
  startedAt: (node: Sql.Descents) => new Date(node.started_at).toISOString(),
  section,
  level: (v) =>
    v.level_value === null
      ? null
      : {
          unit: v.level_unit,
          value: v.level_value,
        },
  ...timestampedResolvers,
};

export default descentFieldResolvers;
