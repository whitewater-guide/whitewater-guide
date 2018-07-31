import { baseResolver, isInputValidResolver, MutationNotAllowedError, TopLevelResolver } from '@apollo';
import db, { rawUpsert } from '@db';
import { GaugeInput, GaugeInputStruct } from '@ww-commons';
import { struct } from 'superstruct';

interface Vars {
  gauge: GaugeInput;
}

const Struct = struct.object({
  gauge: GaugeInputStruct,
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

const queryResolver = isInputValidResolver(Struct).createResolver(resolver);

const upsertGauge = baseResolver.createResolver(
  queryResolver,
);

export default upsertGauge;
