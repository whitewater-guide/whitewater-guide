import { rawUpsert } from '~/db';
import { KMLSection, parseKML } from '~/utils';
import Knex from 'knex';
import groupBy from 'lodash/groupBy';

/**
 * This loads norway map by Evgeny Smirnov
 * https://www.google.com/maps/d/edit?mid=1InzprKvNbLOZQUOvTSEkQ7aDAJg
 * Also adds fields to rivers and sections tables to indicate such import
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  await db.schema.table('sections', (table) => {
    table.string('import_id');
  });
  await db.schema.table('rivers', (table) => {
    table.string('import_id');
  });

  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const sections = parseKML('./dist/migrations/005/norge.kml');
  const byRiver: { [key: string]: KMLSection[] } = groupBy(sections, 'river');
  const rivers = Object.keys(byRiver);
  const selected = await db
    .table('regions_translations')
    .select('region_id')
    .where('name', 'ilike', 'Norway')
    .first();
  if (!selected) {
    return;
  }
  const { region_id: norway } = selected;
  const region = { id: norway };
  const riverIds = await upsertRivers(db, rivers, region);
  for (const section of sections) {
    const riverId = riverIds.get(section.river);
    await upsertSection(db, section, riverId!);
  }
};

const upsertRivers = async (
  db: Knex,
  riverNames: string[],
  region: any,
): Promise<Map<string, string>> => {
  const riverIds: Map<string, string> = new Map<string, string>();
  for (const riverName of riverNames) {
    const exists = await db
      .select('river_id')
      .from('rivers_translations')
      .where('name', 'ilike', riverName)
      .first();
    if (exists) {
      riverIds.set(riverName, exists.river_id);
      continue;
    }
    const inserted = (await rawUpsert(db, 'SELECT upsert_river(?, ?)', [
      { region, name: riverName },
      'en',
    ])) as any;
    if (inserted) {
      riverIds.set(riverName, inserted.id);
      await db
        .table('rivers')
        .update({ import_id: 'norway_smirnov_1' })
        .where({ id: inserted.id });
    }
  }
  return riverIds;
};

const upsertSection = async (
  db: Knex,
  section: KMLSection,
  riverId: string,
) => {
  const rawSection = {
    river: { id: riverId },
    difficulty: section.difficulty,
    difficultyXtra: section.difficultyExtra,
    description: section.description,
    name: section.name,
    shape: section.coordinates,
    hidden: true,
  };
  const result: any = await rawUpsert(db, 'SELECT upsert_section(?, ?)', [
    rawSection,
    'en',
  ]);
  if (result) {
    await db
      .table('sections')
      .update({ import_id: 'norway_smirnov_1' })
      .where({ id: result.id });
  }
};

export const down = async (db: Knex) => {
  await db.schema.table('sections', (table) => {
    table.dropColumn('import_id');
  });
  await db.schema.table('rivers', (table) => {
    table.dropColumn('import_id');
  });

  if (process.env.NODE_ENV === 'test') {
    return;
  }
};

export const configuration = { transaction: true };
