import { Gauge } from '@whitewater-guide/gorge';
import { GaugeInput, PointInput } from '@whitewater-guide/schema';
import keyBy from 'lodash/keyBy';

import { MutationResolvers, UnknownError } from '~/apollo';
import { db, rawUpsert, Sql } from '~/db';
import log from '~/log';

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

const autofillSource: MutationResolvers['autofillSource'] = async (
  _,
  { id },
  { dataSources },
) => {
  const gauges: Sql.GaugesView[] = await db()
    .select(['id', 'code', 'location_id'])
    .from('gauges')
    .where({ source_id: id });
  const codes = keyBy(gauges, 'code');

  const { script, request_params }: Sql.SourcesView = await db()
    .table('sources')
    .select(['script', 'request_params'])
    .where({ id })
    .first();

  try {
    const gaugesIn: Gauge[] = await dataSources.gorge.listGauges(
      script,
      request_params,
    );
    const gaugesOut: Sql.GaugesView[] = [];
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
      try {
        const gOut: Sql.GaugesView = await rawUpsert(
          db(),
          'SELECT upsert_gauge(?, ?)',
          [input, 'en'],
        );
        gaugesOut.push(gOut);
      } catch (e) {
        log.error({ extra: { input }, error: e as Error });
      }
    }
    return gaugesOut;
  } catch (err) {
    throw new UnknownError(`Autofill failed: ${(err as Error).message}`);
  }
};

export default autofillSource;
