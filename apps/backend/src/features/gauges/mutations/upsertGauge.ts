import type { MutationUpsertGaugeArgs } from '@whitewater-guide/schema';
import { GaugeInputSchema } from '@whitewater-guide/schema';
import type { ObjectSchema } from 'yup';
import { object } from 'yup';

import type { MutationResolvers } from '../../../apollo/index';
import { isInputValidResolver } from '../../../apollo/index';
import type { Sql } from '../../../db/index';
import { db, rawUpsert } from '../../../db/index';

const Schema: ObjectSchema<MutationUpsertGaugeArgs> = object({
  gauge: GaugeInputSchema.clone().required(),
});

const upsertGauge: MutationResolvers['upsertGauge'] = async (
  _,
  { gauge },
  { dataSources, language },
) => {
  const result: Sql.GaugesView = await rawUpsert(
    db(),
    'SELECT upsert_gauge(?, ?)',
    [gauge, language],
  );
  if (result?.enabled) {
    dataSources.gorge.updateJobForSource(result.source_id);
  }
  return result;
};

export default isInputValidResolver(Schema, upsertGauge);
