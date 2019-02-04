import { rawUpsert } from '@db';
import { SectionInput } from '@whitewater-guide/commons';
import Knex from 'knex';

export const importSection = async <S>(
  db: Knex,
  section: S,
  transform: (value: S, riverId: string) => SectionInput,
  riverId: string,
  importId: string | ((value: S) => string),
) => {
  const input = transform(section, riverId);
  const import_id = typeof importId === 'string' ? importId : importId(section);
  const result: any = await rawUpsert(db, 'SELECT upsert_section(?, ?)', [
    input,
    'en',
  ]);
  if (result) {
    await db
      .table('sections')
      .update({ import_id })
      .where({ id: result.id });
  }
};
