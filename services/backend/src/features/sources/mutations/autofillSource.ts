import {
  MutationNotAllowedError,
  TopLevelResolver,
  UnknownError,
} from '@apollo';
import db, { rawUpsert } from '@db';
import { GaugeRaw } from '@features/gauges';
import { GaugeInput, PointInput } from '@whitewater-guide/commons';
import keyBy from 'lodash/keyBy';
import { GorgeGauge } from '../../gorge/types';
import { SourceRaw } from '../types';

interface Vars {
  id: string;
}

const convertLocation = (
  info: GorgeGauge,
  locationId: string | null,
): PointInput | null => {
  const { location, name } = info;
  return location
    ? {
        id: locationId,
        name: `Gauge ${name}`,
        description: null,
        kind: 'gauge',
        coordinates: [
          location.longitude,
          location.latitude,
          location.altitude || 0,
        ],
      }
    : null;
};

const autofillSource: TopLevelResolver<Vars> = async (
  root,
  { id },
  { dataSources },
) => {
  const enabled = await dataSources.gorge.isSourceEnabled(id);
  if (enabled) {
    throw new MutationNotAllowedError('Cannot autofill source that is enabled');
  }

  const gauges: GaugeRaw[] = await db()
    .select(['id', 'code', 'location_id'])
    .from('gauges')
    .where({ source_id: id });
  const codes = keyBy(gauges, 'code');

  const { script, request_params }: SourceRaw = await db()
    .table('sources')
    .select(['script', 'request_params'])
    .where({ id })
    .first();

  try {
    const gaugesIn: GorgeGauge[] = await dataSources.gorge.listGauges(
      script,
      request_params,
    );
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
        url: g.url || null,
      };
      const gOut = await rawUpsert(db(), 'SELECT upsert_gauge(?, ?)', [
        input,
        'en',
      ]);
      gaugesOut.push(gOut);
    }
    return gaugesOut;
  } catch (err) {
    throw new UnknownError('Autofill failed: ' + err.message);
  }
};

export default autofillSource;
