import { isInputValidResolver, TopLevelResolver } from '~/apollo';
import db, { rawUpsert } from '~/db';
import { GaugeInput, GaugeInputSchema } from '@whitewater-guide/commons';
import * as yup from 'yup';
import { GaugeRaw } from '../types';

interface Vars {
  gauge: GaugeInput;
}

const Struct = yup.object({
  gauge: GaugeInputSchema,
});

const resolver: TopLevelResolver<Vars> = async (
  _,
  { gauge },
  { dataSources, language },
) => {
  const result: GaugeRaw = await rawUpsert(db(), 'SELECT upsert_gauge(?, ?)', [
    gauge,
    language,
  ]);
  if (result?.enabled) {
    dataSources.gorge.updateJobForSource(result.source_id);
  }
  return result;
};

const upsertGauge = isInputValidResolver(Struct, resolver);

export default upsertGauge;
