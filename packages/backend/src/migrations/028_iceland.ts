import Knex from 'knex';
import { resolve } from 'path';

import { parseKML } from './028/parser';
import transformer from './028/transformer';
import { groupByRiver, importRivers, importSection } from './utils';

/**
 * Imports rivers of Iceland from https://www.google.com/maps/d/u/0/viewer?mid=1Wf5q9tawx5uU9vB-fNORRVLyXSQ&msa=0&ll=0%2C0&z=5
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  const kmlFile = resolve(__dirname, '028/iceland.kml');
  const rawSections = parseKML(kmlFile);
  const byRiver = groupByRiver(rawSections, 'river');
  const riverNames = Array.from(byRiver.keys());
  const riverIds = await importRivers(
    db,
    riverNames,
    { id: '9521e034-e090-11e9-9026-274ceebb623d' },
    'iceland1',
  );

  for (const section of rawSections) {
    const riverId = riverIds.get(section.river);
    if (!riverId) {
      console.info('Not FOUND', section);
      continue;
    }
    await importSection(db, section, transformer, riverId, 'iceland1');
  }
};

export const down = async (db: Knex) => {
  await db.table('sections').delete().where('import_id', '=', 'iceland1');
  await db.table('rivers').delete().where('import_id', '=', 'iceland1');
};

export const configuration = { transaction: true };
