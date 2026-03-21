import type { Knex } from 'knex';

import { createViews, dropViews, runSqlFile } from '../db/index';
import { resolveRelative } from '../utils/index';

const VIEWS = ['gauges', 'media', 'sections', 'rivers', 'regions'];

/**
 * This patch adds license field and copyright field to regions, sections and media
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export async function up(db: Knex): Promise<void> {
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

  await runSqlFile(db, resolveRelative(__dirname, '039/upsert_region.sql'));
  await runSqlFile(db, resolveRelative(__dirname, '039/upsert_section.sql'));
  await runSqlFile(
    db,
    resolveRelative(__dirname, '039/upsert_section_media.sql'),
  );
}

export async function down(db: Knex): Promise<void> {
  await dropViews(db, ...VIEWS);
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS upsert_section_media(section_id VARCHAR, media JSON, lang LANGUAGE_CODE) CASCADE',
  );
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS upsert_section(section JSON, lang LANGUAGE_CODE) CASCADE',
  );
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS upsert_region(r JSON, lang LANGUAGE_CODE) CASCADE',
  );

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

  await runSqlFile(db, resolveRelative(__dirname, '038/upsert_region.sql'));
  await runSqlFile(db, resolveRelative(__dirname, '038/upsert_section.sql'));
  await runSqlFile(
    db,
    resolveRelative(__dirname, '038/upsert_section_media.sql'),
  );
}
