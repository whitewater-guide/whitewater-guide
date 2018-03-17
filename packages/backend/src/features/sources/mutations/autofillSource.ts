import { GraphQLFieldResolver } from 'graphql';
import { isAdminResolver, MutationNotAllowedError, UnknownError } from '../../../apollo';
import db, { rawUpsert } from '../../../db';
import { GaugeInput, PointInput } from '../../../ww-commons';
import { execScript, ScriptCommand, ScriptGaugeInfo } from '../../scripts';
import { SourceRaw } from '../types';

interface Variables {
  id: string;
}

const resolver: GraphQLFieldResolver<any, any> = async (root, { id }: Variables) => {
  const { count } = await db().table('gauges').where({ source_id: id }).count().first();

  if (count > 0) {
    throw new MutationNotAllowedError({ message: 'Cannot autofill source that already has gauges' });
  }
  const { enabled, script }: SourceRaw = await db().table('sources')
    .select(['script', 'enabled']).where({ id }).first();
  if (enabled) {
    throw new MutationNotAllowedError({ message: 'Cannot autofill source that is enabled' });
  }
  const { success, error, data } = await execScript<ScriptGaugeInfo>({
    command: ScriptCommand.AUTOFILL,
    script,
  });
  if (!success) {
    throw new UnknownError({ message: `Autofill failed: ${error}` });
  }
  // This is slow, but it's executed rarely
  const gaugesIn: ScriptGaugeInfo[] = data || [];
  const gaugesOut = [];
  for (const g of gaugesIn) {
    const { latitude, longitude, altitude } = g.location;
    const location: PointInput | null = (latitude && longitude) ?
      {
        id: null,
        name: `Gauge ${g.name}`,
        description: null,
        kind: 'gauge',
        coordinates: [longitude, latitude, altitude]
      } : null;
    const input: GaugeInput = {
      id: null,
      name: g.name,
      source: { id },
      location,
      code: g.code,
      levelUnit: g.levelUnit || null,
      flowUnit: g.flowUnit || null,
      requestParams: null,
      cron: null,
      url: g.url,
    };
    const gOut = await rawUpsert(db(), `SELECT upsert_gauge('${JSON.stringify(input)}', 'en')`);
    gaugesOut.push(gOut);
  }
  return gaugesOut;
};

const autofillSource = isAdminResolver.createResolver(
  resolver,
);

export default autofillSource;
