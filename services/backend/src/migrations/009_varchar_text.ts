import { createViews, dropViews } from '~/db';
import Knex, { ColumnBuilder } from 'knex';

const VIEWS = [
  'gauges',
  'groups',
  'media',
  'sections',
  'rivers',
  'regions',
  'sources',
  'tags',
  'points',
];

const VARCHAR_TO_TEXT = [
  'gauges.url',
  'gauges_translations.name#notnull',
  'groups_translations.name#notnull',
  'logins.username#notnull',
  'media.url#notnull',
  'media_translations.copyright',
  'points_translations.name',
  'regions_translations.name#notnull',
  'regions_translations.season',
  'rivers_translations.name#notnull',
  'sections_translations.name#notnull',
  'sections_translations.season',
  'sections_translations.flows_text',
  'sources.url',
  'sources_translations.name#notnull',
  'tags_translations.name#notnull',
  'transactions.transaction_id#notnull',
  'transactions.product_id#notnull',
  'transactions.receipt',
  'users.name#notnull',
  'users.avatar',
  'users.email',
];

const alterMany = async (db: Knex, toText: boolean) => {
  const toTextByTable: Map<string, string[]> = VARCHAR_TO_TEXT.reduce(
    (acc: Map<string, string[]>, fullColumn) => {
      const [table, column] = fullColumn.split('.');
      return acc.set(table, (acc.get(table) || []).concat(column));
    },
    new Map(),
  );

  for (const [table, columns] of toTextByTable) {
    await db.schema.alterTable(table, (tbl) => {
      const typeFunc: (name: string) => ColumnBuilder = toText
        ? tbl.text.bind(tbl)
        : tbl.string.bind(tbl);
      for (const column of columns) {
        const [columnName, notNull] = column.split('#');
        if (notNull) {
          typeFunc(columnName)
            .notNullable()
            .alter();
        } else {
          typeFunc(columnName).alter();
        }
      }
    });
  }
};

/**
 * This patch brings some sanity into which fields should be limited (varchar 255 or less)
 * And which fields should be unlimited.
 * I.e. there is no reason to limit urls to 255 chars,
 * and limiting transaction fields to 255 is really bad idea
 */
export const up = async (db: Knex) => {
  // Need to drop views first
  await dropViews(db, ...VIEWS);
  // Varchar to text
  await alterMany(db, true);
  await db.schema.alterTable('rivers_translations', (tbl) => {
    tbl
      .specificType('alt_names', 'text[]')
      .notNullable()
      .defaultTo('{}')
      .alter();
  });
  await db.schema.alterTable('sections_translations', (tbl) => {
    tbl
      .specificType('alt_names', 'text[]')
      .notNullable()
      .defaultTo('{}')
      .alter();
  });
  // Text to varchar
  await db.schema.alterTable('points', (tbl) => {
    tbl
      .string('kind')
      .notNullable()
      .alter();
  });
  // Raise cron char limit
  await db.schema.alterTable('sources', (tbl) => {
    tbl.string('cron', 255).alter();
  });
  await createViews(db, 9, ...VIEWS);
};

export const down = async (db: Knex) => {
  await dropViews(db, ...VIEWS);
  // Text back to varchar
  await alterMany(db, false);
  await db.schema.alterTable('rivers_translations', (tbl) => {
    tbl
      .specificType('alt_names', 'varchar[]')
      .notNullable()
      .defaultTo('{}')
      .alter();
  });
  await db.schema.alterTable('sections_translations', (tbl) => {
    tbl
      .specificType('alt_names', 'varchar[]')
      .notNullable()
      .defaultTo('{}')
      .alter();
  });
  // Varchar back to text
  await db.schema.alterTable('points', (tbl) => {
    tbl
      .text('kind')
      .notNullable()
      .alter();
  });
  // Decrease back cron char limit
  await db.schema.alterTable('sources', (tbl) => {
    tbl.string('cron', 50).alter();
  });
  await createViews(db, 8, ...VIEWS);
};

export const configuration = { transaction: true };
