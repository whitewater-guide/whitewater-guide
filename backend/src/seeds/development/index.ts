import Knex = require('knex');
import { GaugeRaw } from '../../features/gauges';
import { HarvestMode, SourceRaw } from '../../features/sources';

type PSource = Partial<SourceRaw>;

const SOURCES: PSource[] = [
  {
    name: 'Galicia',
    script: 'galicia',
    cron: '0 * * * *',
    harvest_mode: HarvestMode.ALL_AT_ONCE,
    url: 'http://ya.ru',
    enabled: false,
    terms_of_use: 'Terms of use',
  },
  {
    name: 'Norway',
    script: 'norway',
    harvest_mode: HarvestMode.ALL_AT_ONCE,
    enabled: true,
  },
];

type Pgauge = Partial<GaugeRaw>;

const GAUGES: Pgauge[] = [
  {
    source_id: '0',
    name: 'Galicia gauge 1',
    code: 'gal1',
    level_unit: 'cm',
    flow_unit: 'm3/s',
    request_params: JSON.stringify({ foo: 'bar' }),
    last_timestamp: new Date(),
    url: 'http://ya.ru',
    enabled: false,
  },
  {
    source_id: '0',
    name: 'Galicia gauge 2',
    code: 'gal2',
    enabled: false,
  },
  {
    source_id: '1',
    name: 'Norway gauge 1',
    code: 'nor1',
    level_unit: 'cm',
    flow_unit: 'm3/s',
    request_params: JSON.stringify({ nor: 'way' }),
    last_timestamp: new Date(),
    url: 'http://yarr.ru',
    enabled: true,
  },
  {
    source_id: '1',
    name: 'Norway gauge 2',
    code: 'nor2',
    enabled: true,
  },
];

export async function seed(db: Knex) {
  await db.table('sources').del();

  const sources: SourceRaw[] = await Promise.all(SOURCES.map(source =>
    db.table('sources')
      .insert(source)
      .returning('id')
      .then(ids => db.table('sources').where('id', '=', ids[0]).first()),
  ));
  let gauges = GAUGES.map(gauge => ({ ...gauge, source_id: sources[Number(gauge.source_id)].id }));
  gauges = await Promise.all(gauges.map(gauge =>
    db.table('gauges')
      .insert(gauge)
      .returning('id')
      .then(ids => db.table('gauges').where('id', '=', ids[0]).first()),
  ));
}
