import { Descent } from '@whitewater-guide/commons';
import { FieldResolvers } from '~/apollo';
import { timestampResolvers } from '~/db';
import { RawTimestamped } from '../../../db/types';
import { DescentRaw } from '../types';

const descentFieldResolvers: FieldResolvers<DescentRaw, Descent> = {
  startedAt: (node: RawTimestamped) => new Date(node.created_at).toISOString(),
  level: (v) =>
    v.level_value === null
      ? null
      : {
          unit: v.level_unit,
          value: v.level_value,
        },
  ...timestampResolvers,
};

export default descentFieldResolvers;
