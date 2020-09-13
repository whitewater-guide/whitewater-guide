import { readFileSync } from 'fs';
import Knex from 'knex';
import path from 'path';

import { RivermapData, transformRivermapSection } from './012';
import {
  getRegionsForMatching,
  groupByRegion,
  groupByRiver,
  importRivers,
  importSection,
  UNKNOWN_REGION,
} from './utils';

/**
 * This loads rivermap.ch database dump (https://www.rivermap.ch/public/ODBL/extract.json)
 * Current dump stats:
 *   Types: 1547 sections, 26 playspots, 27 slaloms, 11 drops
 *   Countries: CH - 271 DE - 115 FR - 528 AT - 236 IT - 262 SI - 31 GR - 31 NO - 66 ME - 16 AL - 10 XK - 2 BA - 1 CZ - 19 PL - 12 ES - 8 HR - 3
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  const txt = readFileSync(
    path.resolve(__dirname, '012/rivermap_extract.json'),
    {
      encoding: 'utf8',
    },
  );
  const json: RivermapData = JSON.parse(txt);

  const regionsRows = await getRegionsForMatching(db);

  const byRegions = groupByRegion(regionsRows, json.data.sections, (s) => [
    s.lngstart,
    s.latstart,
  ]);
  console.info('[META] Rivermap.CH region stats:');
  for (const [k, v] of byRegions) {
    console.info(`[META]\t${k.name}: ${v.length}`);
    if (k === UNKNOWN_REGION) {
      continue;
    }
    if (k.name === 'Norway') {
      console.info(`[META]\t${k.name}: skipping`);
      continue;
    }
    const byRiver = groupByRiver(v, 'river');
    const riverNames = Array.from(byRiver.keys());
    const riverIds = await importRivers(db, riverNames, k, 'rivermap1');
    for (const section of v) {
      const riverId = riverIds.get(section.river);
      if (!riverId) {
        console.info('Not FOUND', section);
        continue;
      }
      await importSection(
        db,
        section,
        transformRivermapSection,
        riverId,
        (s) => `rivermap1_${s.id}`,
      );
    }
  }
};

export const down = async (db: Knex) => {
  await db.table('sections').delete().where('import_id', 'like', `rivermap1_%`);
  await db.table('rivers').delete().where('import_id', 'like', `rivermap1_%`);
};

export const configuration = { transaction: true };
