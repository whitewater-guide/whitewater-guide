import { rawUpsert } from '~/db';
import Knex from 'knex';
import deburr from 'lodash/deburr';

export const importRivers = async (
  db: Knex,
  riverNames: string[],
  region: { id: string },
  importId: string,
): Promise<Map<string, string>> => {
  const riverIds: Map<string, string> = new Map<string, string>();
  for (const riverName of riverNames) {
    const exists = await db
      .select('id')
      .from('rivers_view')
      .where('name', 'ilike', riverName)
      .andWhere({ language: 'en' })
      .andWhere({ region_id: region.id })
      .first();
    if (exists) {
      riverIds.set(riverName, exists.id);
      continue;
    }
    const altNames = deburr(riverName) === riverName ? [] : [deburr(riverName)];
    const inserted = (await rawUpsert(db, 'SELECT upsert_river(?, ?)', [
      { region, name: riverName, altNames },
      'en',
    ])) as any;
    if (inserted) {
      riverIds.set(riverName, inserted.id);
      await db
        .table('rivers')
        .update({ import_id: importId })
        .where({ id: inserted.id });
    }
  }
  return riverIds;
};
