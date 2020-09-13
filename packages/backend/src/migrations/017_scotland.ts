import { readJSONSync } from 'fs-extra';
import Knex from 'knex';
import path from 'path';

import { GaugeRaw } from '~/features/gauges';

import { getTransform, InputSection, normalize } from './017/transform';
import { groupByRiver, importRivers, importSection } from './utils';

/**
 * Imports scottish rivers from http://canoescotland.org/wheres-the-water/data/river-sections.json
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  let inputSections: InputSection[] = readJSONSync(
    path.resolve(__dirname, '017/scotland.json'),
    {
      encoding: 'utf8',
    },
  );
  inputSections = inputSections.filter((v) => {
    const hasShape =
      !!v.put_in_lat && !!v.put_in_long && !!v.get_out_lat && !!v.get_out_long;
    if (!hasShape) {
      console.info(`No shape: ${v.name}`);
    }
    return hasShape;
  });
  inputSections.forEach(normalize);
  const byRiver = groupByRiver(inputSections, 'riverName');
  const riverNames = Array.from(byRiver.keys());
  const riverIds = await importRivers(
    db,
    riverNames,
    { id: '75a9c07e-4fc6-11e9-b032-0fb8eb27dd3e' },
    'scotland1',
  );
  const gauges: GaugeRaw[] = await db
    .select(['id', 'code', 'source_id'])
    .from('gauges')
    .where({ source_id: '166b206c-6524-11e9-8820-831852e1cfb6' });
  for (const section of inputSections) {
    const riverId = riverIds.get(section.riverName);
    if (!riverId) {
      console.info('Not FOUND', section);
      continue;
    }
    await importSection(
      db,
      section,
      getTransform(gauges),
      riverId,
      (s) => `scotland1_${s.sca_guidebook_no}`,
    );
  }
};

export const down = async (db: Knex) => {
  await db.table('sections').delete().where('import_id', 'like', `scotland1_%`);
  await db.table('rivers').delete().where('import_id', 'like', `scotland1_%`);
};

export const configuration = { transaction: true };
