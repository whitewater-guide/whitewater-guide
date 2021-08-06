import {
  GaugeInputSchema,
  MutationUpsertGaugeArgs,
} from '@whitewater-guide/schema';
import * as yup from 'yup';

import { isInputValidResolver, MutationResolvers } from '~/apollo';
import { db, rawUpsert, Sql } from '~/db';

const Schema: yup.SchemaOf<MutationUpsertGaugeArgs> = yup.object({
  gauge: GaugeInputSchema.clone(),
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
