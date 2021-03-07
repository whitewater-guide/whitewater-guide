import Knex from 'knex';
import path from 'path';

import { createViews, dropViews, runSqlFile } from '~/db';

const VIEWS = ['media', 'sections', 'rivers', 'regions'];

/**
 * This patch adds license field and copyright field to regions, sections and media
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  await dropViews(db, ...VIEWS);

  await db.schema.table('sections', (table) => {
    table.jsonb('license').nullable();
  });
  await db.schema.table('sections_translations', (table) => {
    table.string('copyright').nullable();
  });

  await db.schema.table('regions', (table) => {
    table.jsonb('license').nullable();
  });
  await db.schema.table('regions_translations', (table) => {
    table.string('copyright').nullable();
  });

  await db.schema.table('media', (table) => {
    table.jsonb('license').nullable();
  });

  await createViews(db, 39, ...VIEWS);

  await runSqlFile(db, path.resolve(__dirname, '039/upsert_region.sql'));
  await runSqlFile(db, path.resolve(__dirname, '039/upsert_section.sql'));
  await runSqlFile(db, path.resolve(__dirname, '039/upsert_section_media.sql'));
};

export const down = async (db: Knex) => {
  await dropViews(db, ...VIEWS);

  await db.schema.table('sections', (table) => {
    table.dropColumn('license');
  });
  await db.schema.table('sections_translations', (table) => {
    table.dropColumn('copyright');
  });

  await db.schema.table('regions', (table) => {
    table.dropColumn('license');
  });
  await db.schema.table('regions_translations', (table) => {
    table.dropColumn('copyright');
  });

  await db.schema.table('media', (table) => {
    table.dropColumn('license');
  });

  await createViews(db, 38, ...VIEWS);

  await runSqlFile(db, path.resolve(__dirname, '038/upsert_region.sql'));
  await runSqlFile(db, path.resolve(__dirname, '038/upsert_section.sql'));
  await runSqlFile(db, path.resolve(__dirname, '038/upsert_section_media.sql'));
};

export const configuration = { transaction: true };
