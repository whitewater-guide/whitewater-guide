import {
  MutationNotAllowedError,
  TopLevelResolver,
  UnknownError,
} from '@apollo';
import db, { rawUpsert } from '@db';
import { GaugeRaw } from '@features/gauges';
import { PointRaw } from '@features/points';
import { GaugeInput, PointInput } from '@whitewater-guide/commons';
import keyBy from 'lodash/keyBy';
import { execScript, ScriptCommand, ScriptGaugeInfo } from '../../scripts';
import { SourceRaw } from '../types';

interface Vars {
  id: string;
}

const convertLocation = (
  info: ScriptGaugeInfo,
  locationId: string | null,
): PointInput | null => {
  const { location, name } = info;
  const { latitude, longitude, altitude } = location;
  return latitude && longitude
    ? {
        id: locationId,
        name: `Gauge ${name}`,
        description: null,
        kind: 'gauge',
        coordinates: [longitude, latitude, altitude],
      }
    : null;
};

const autofillSource: TopLevelResolver<Vars> = async (root, { id }) => {
  const gauges: GaugeRaw[] = await db()
    .select(['id', 'code', 'location_id'])
    .from('gauges')
    .where({ source_id: id });
  const codes = keyBy(gauges, 'code');

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
    const existing = codes[g.code];
    const input: GaugeInput = {
      id: existing ? existing.id : null,
      name: g.name,
      source: { id },
      location: convertLocation(g, existing ? existing.location_id : null),
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
