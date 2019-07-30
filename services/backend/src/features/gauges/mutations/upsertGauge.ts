import {
  isInputValidResolver,
  MutationNotAllowedError,
  TopLevelResolver,
} from '@apollo';
import db, { rawUpsert } from '@db';
import { GaugeInput, GaugeInputSchema } from '@whitewater-guide/commons';
import * as yup from 'yup';

interface Vars {
  gauge: GaugeInput;
}

const Struct = yup.object({
  gauge: GaugeInputSchema,
});

const resolver: TopLevelResolver<Vars> = async (
  root,
  { gauge },
  { language },
) => {
  if (gauge.id) {
    const { enabled } = await db()
      .table('gauges')
      .select(['enabled'])
      .where({ id: gauge.id })
      .first();
    if (enabled) {
      throw new MutationNotAllowedError('Disable gauge before editing it');
    }
  }
  return rawUpsert(db(), 'SELECT upsert_gauge(?, ?)', [gauge, language]);
};

const upsertGauge = isInputValidResolver(Struct, resolver);

export default upsertGauge;
