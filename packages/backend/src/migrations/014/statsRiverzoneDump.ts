import chalk from 'chalk';
import flatMap from 'lodash/flatMap';
import isArray from 'lodash/isArray';

import { prettyPrintStats, statsByKeys } from '../../utils';
import { parseRiverzoneDump } from './parseRiverzoneDump';

const log = (...args: any) =>
  console.info(chalk.bgGreen.black('[RZ]'), ...args);

const classify = (v: any) => {
  if (v === null) {
    return 'NULL';
  }
  if (v === undefined) {
    return 'UNDEFINED';
  }
  if (isArray(v)) {
    if (v.length === 0) {
      return 'EMPTY ARRAY';
    }
    if (v.every((i) => i === 0)) {
      return 'ARRAY OF ZEROES';
    }
    if (v.every((i) => i === null)) {
      return 'ARRAY OF NULLS';
    }
    if (v.every((i) => !i)) {
      return 'ARRAY OF FALSY';
    }
    if (v.some((i) => !i)) {
      return 'ARRAY WITH SOME FALSY';
    }
    return 'SOME ARRAY';
  }
  return 'OTHER';
};

const statsRiverzoneDump = async () => {
  const root = await parseRiverzoneDump();
  const pois = flatMap(root.sections, (s) => s.pois);
  const stats = statsByKeys(root.sections, [
    { key: 'countryCode', name: 'Country code' },
    { key: 'category', name: 'Category' },
    { key: 'putInLatLng', name: 'Put-in', transform: classify },
    { key: 'takeOutLatLng', name: 'Take-out', transform: classify },
    { key: 'grade', name: 'Grade' },
    { key: 'gauge', name: 'Gauge', transform: (g) => g.unit },
    { key: 'polys', name: 'POLYS', transform: classify },
    { key: 'gaugesAlt', name: 'Gauges alt', transform: classify },
  ]);
  const poiStats = statsByKeys(pois, [{ key: 'type', name: 'POI Type' }]);
  log(`Total: ${root.sections.length} sections`);
  prettyPrintStats(stats, log);
  prettyPrintStats(poiStats, log);
};

statsRiverzoneDump();
