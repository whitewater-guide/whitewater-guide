import {
  MutationNotAllowedError,
  TopLevelResolver,
  UnknownError,
} from '@apollo';
import db, { rawUpsert } from '@db';
import { GaugeInput, PointInput } from '@whitewater-guide/commons';
import { execScript, ScriptCommand, ScriptGaugeInfo } from '../../scripts';
import { SourceRaw } from '../types';

interface Vars {
  id: string;
}

const autofillSource: TopLevelResolver<Vars> = async (root, { id }) => {
  const { count } = await db()
    .table('gauges')
    .where({ source_id: id })
    .count()
    .first();

  if (count > 0) {
    throw new MutationNotAllowedError(
      'Cannot autofill source that already has gauges',
    );
  }
  const { enabled, script, request_params }: SourceRaw = await db()
    .table('sources')
    .select(['script', 'enabled', 'request_params'])
    .where({ id })
    .first();
  if (enabled) {
    throw new MutationNotAllowedError('Cannot autofill source that is enabled');
  }
  const { success, error, data } = await execScript<ScriptGaugeInfo[]>({
    command: 'autofill' as ScriptCommand,
    script,
    extras: request_params || {},
  });
  if (!success) {
    throw new UnknownError(`Autofill failed: ${error}`);
  }
  // This is slow, but it's executed rarely
  const gaugesIn: ScriptGaugeInfo[] = data || [];
  const gaugesOut = [];
  for (const g of gaugesIn) {
    const { latitude, longitude, altitude } = g.location;
    const location: PointInput | null =
      latitude && longitude
        ? {
            id: null,
            name: `Gauge ${g.name}`,
            description: null,
            kind: 'gauge',
            coordinates: [longitude, latitude, altitude],
          }
        : null;
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
    const gOut = await rawUpsert(db(), 'SELECT upsert_gauge(?, ?)', [
      input,
      'en',
    ]);
    gaugesOut.push(gOut);
  }
  return gaugesOut;
};

export default autofillSource;
