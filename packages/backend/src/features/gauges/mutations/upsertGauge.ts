import { baseResolver, isInputValidResolver, MutationNotAllowedError, TopLevelResolver } from '@apollo';
import db, { rawUpsert } from '@db';
import { GaugeInput, GaugeInputSchema } from '@ww-commons';
import Joi from 'joi';

interface Vars {
  gauge: GaugeInput;
}

const Schema = Joi.object().keys({
  gauge: GaugeInputSchema,
});

const resolver: TopLevelResolver<Vars> = async (root, { gauge }, { language }) => {
  if (gauge.id) {
    const { enabled } = await db().table('gauges').select(['enabled']).where({ id: gauge.id }).first();
    if (enabled) {
      throw new MutationNotAllowedError({ message: 'Disable gauge before editing it' });
    }
  }
  return rawUpsert(db(), 'SELECT upsert_gauge(?, ?)', [gauge, language]);
};

const queryResolver = isInputValidResolver(Schema).createResolver(resolver);

const upsertGauge = baseResolver.createResolver(
  queryResolver,
);

export default upsertGauge;
