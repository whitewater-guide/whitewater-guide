import { GaugeInput, PointInput } from '@whitewater-guide/commons';
import { TopLevelResolver, UnknownError } from '@apollo';
import db, { rawUpsert } from '@db';

import { Gauge } from '@whitewater-guide/gorge';
import { GaugeRaw } from '@features/gauges';
import { SourceRaw } from '../types';
import keyBy from 'lodash/keyBy';

interface Vars {
  id: string;
}

const convertLocation = (
  info: Gauge,
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
  _,
  { id },
  { dataSources },
) => {
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
    const gaugesIn: Gauge[] = await dataSources.gorge.listGauges(
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
