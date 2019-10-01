import { rawUpsert } from '@db';
import { SectionInput } from '@whitewater-guide/commons';
import Knex from 'knex';

// tslint:disable:no-console
export const importSection = async <S>(
  db: Knex,
  section: S,
  transform: (value: S, riverId: string) => Omit<SectionInput, 'helpNeeded'>,
  riverId: string,
  importId: string | ((value: S) => string),
) => {
  const input = transform(section, riverId);
  const import_id = typeof importId === 'string' ? importId : importId(section);
  let result: any;
  try {
    result = await rawUpsert(db, 'SELECT upsert_section(?, ?)', [input, 'en']);
    if (Array.isArray(result)) {
      result = result[0]; // upsert_section function used to return just section object
    }
    if (result) {
      await db
        .table('sections')
        .update({ import_id })
        .where({ id: result.id });
    }
  } catch (e) {
    console.log('Import failed: ' + e.message);
    console.dir(input);
  }
};
