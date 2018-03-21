import db from '../db';

export const countRows = async (getKnexInstance: boolean, ...tables: string[]) => {
  const rawQuery = 'SELECT ' + tables
    .map(table => db(getKnexInstance).table(table).count(`* as ${table}_cnt`).toString())
    .map(query => `(${query})`)
    .join(', ');
  const { rows: [ counts ] } = await db(getKnexInstance).raw(rawQuery);
  return tables.map(t => Number(counts[`${t}_cnt`]));
};
