import { Descent } from '@whitewater-guide/commons';
import { FieldResolvers } from '~/apollo';
import { timestampResolvers } from '~/db';
import { DescentRaw } from '../types';
import section from './section';

const descentFieldResolvers: FieldResolvers<DescentRaw, Descent> = {
  startedAt: (node: DescentRaw) => new Date(node.started_at).toISOString(),
  section,
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
