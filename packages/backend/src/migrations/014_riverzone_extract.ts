import Knex from 'knex';

import {
  getRiverzoneGaugeIds,
  parseRiverzoneDump,
  RzSection,
  transformRiverzoneSection,
} from './014';
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
  let { sections } = await parseRiverzoneDump();
  const dumpSize = sections.length;
  console.info('[META] Riverzone.eu region stats:');
  console.info(`[META] \t total sections in dump: ${dumpSize}`);
  const good: RzSection[] = [];
  let bad: RzSection[] = [];
  for (const s of sections) {
    if (s.putInLatLng) {
      good.push(s);
    } else {
      bad.push(s);
    }
  }
  sections = good;
  console.info(`[META] \t total sections with put-in: ${sections.length}`);
  let unknownRegionCount = 0;
  let gaugeNotFoundCount = 0;

  const regionsRows = await getRegionsForMatching(db);
  const rzGaugeIds = await getRiverzoneGaugeIds(db);

  const byRegions = groupByRegion(regionsRows, sections, (s) => [
    s.putInLatLng![1] / 1000000,
    s.putInLatLng![0] / 1000000,
  ]);
  for (const [k, v] of byRegions) {
    console.info(`[META]\t${k.name}: ${v.length}`);
    if (k === UNKNOWN_REGION) {
      bad = bad.concat(v);
      unknownRegionCount += v.length;
      continue;
    }
    const byRiver = groupByRiver(v, 'riverName');
    const riverNames = Array.from(byRiver.keys());
    const riverIds = await importRivers(db, riverNames, k, 'riverzone1');
    for (const section of v) {
      const riverId = riverIds.get(section.riverName);
      if (!riverId) {
        bad.push(section);
        console.info('Not FOUND', section);
        continue;
      }
      // replace their code with our code
      section.gauge.id = rzGaugeIds.get(section.gauge.id) || '';
      if (!section.gauge.id) {
        gaugeNotFoundCount += 1;
      }
      await importSection(
        db,
        section,
        transformRiverzoneSection,
        riverId,
        (s) => `riverzone1_${s.id}`,
      );
    }
  }
  console.info(
    `[META] \t total sections with unknown regions: ${unknownRegionCount}`,
  );
  console.info(`[META] \t total sections without gauge: ${gaugeNotFoundCount}`);
  // await writeJSON(path.resolve(__dirname, '014/riverzone_skipped.json'), bad);
};

export const down = async (db: Knex) => {
  await db
    .table('sections')
    .delete()
    .where('import_id', 'like', `riverzone1_%`);
  await db.table('rivers').delete().where('import_id', 'like', `riverzone1_%`);
};

export const configuration = { transaction: true };
