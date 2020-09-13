import Knex from 'knex';

import { importRainchasers, transformSection } from './019';
import { groupByRiver, importRivers, importSection } from './utils';

/**
 * Imports rivers from rainchasers.com
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  console.info('Importing rainchasers');
  const rcSection = await importRainchasers();
  const byRiver = groupByRiver(rcSection, 'river');
  const riverNames = Array.from(byRiver.keys());
  const riverIds = await importRivers(
    db,
    riverNames,
    { id: '499102d2-8ac1-11e9-9aed-7b9b5525d41e' },
    'rainchasers1',
  );
  for (const section of rcSection) {
    const riverId = riverIds.get(section.river);
    if (!riverId) {
      console.info('Not FOUND', section);
      continue;
    }
    await importSection(
      db,
      section,
      transformSection,
      riverId,
      (s) => `rainchasers1_${s.uuid}`,
    );
  }
  console.info(`Imported ${rcSection.length} sections from  rainchasers`);
};

export const down = async (db: Knex) => {
  await db
    .table('sections')
    .delete()
    .where('import_id', 'like', `rainchasers1_%`);
  await db
    .table('rivers')
    .delete()
    .where('import_id', 'like', `rainchasers1_%`);
};

export const configuration = { transaction: true };
