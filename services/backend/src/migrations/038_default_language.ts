import Knex from 'knex';
import { createViews, dropViews, runSqlFile } from '~/db';

const VIEWS = ['gauges', 'sources', 'sections', 'rivers', 'regions'];

/**
 * This patch adds default language to regions, rivers and sections
 * It also changes views logic to use default language instead of english
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  await dropViews(db, ...VIEWS);

  // Sources
  await db.schema.table('sources', (table) => {
    table.specificType('default_lang', 'language_code').nullable();
  });
  await db.raw(`WITH translations AS
    (SELECT DISTINCT ON (source_id) source_id, created_at, language FROM sources_translations ORDER BY source_id, created_at ASC, source_id)
    UPDATE sources
    SET default_lang = translations.language
    FROM translations
    WHERE translations.source_id = sources.id
  `);
  await db.schema.alterTable('sources', (table) => {
    table
      .specificType('default_lang', 'language_code')
      .notNullable()
      .alter();
  });
  await runSqlFile(db, './dist/migrations/038/upsert_source.sql');

  // Gauges
  await db.schema.table('gauges', (table) => {
    table.specificType('default_lang', 'language_code').nullable();
  });
  await db.raw(`WITH translations AS
    (SELECT DISTINCT ON (gauge_id) gauge_id, created_at, language FROM gauges_translations ORDER BY gauge_id, created_at ASC, gauge_id)
    UPDATE gauges
    SET default_lang = translations.language
    FROM translations
    WHERE translations.gauge_id = gauges.id
`);
  await db.schema.alterTable('gauges', (table) => {
    table
      .specificType('default_lang', 'language_code')
      .notNullable()
      .alter();
  });
  await runSqlFile(db, './dist/migrations/038/upsert_gauge.sql');

  // Regions
  await db.schema.table('regions', (table) => {
    table.specificType('default_lang', 'language_code').nullable();
  });
  await db.raw(`WITH translations AS
    (SELECT DISTINCT ON (region_id) region_id, created_at, language FROM regions_translations ORDER BY region_id, created_at ASC, region_id)
    UPDATE regions
    SET default_lang = translations.language
    FROM translations
    WHERE translations.region_id = regions.id
  `);
  await db.schema.alterTable('regions', (table) => {
    table
      .specificType('default_lang', 'language_code')
      .notNullable()
      .alter();
  });
  await runSqlFile(db, './dist/migrations/038/upsert_region.sql');

  // Rivers
  await db.schema.table('rivers', (table) => {
    table.specificType('default_lang', 'language_code').nullable();
  });
  await db.raw(`WITH translations AS
    (SELECT DISTINCT ON (river_id) river_id, created_at, language FROM rivers_translations ORDER BY river_id, created_at ASC, river_id)
    UPDATE rivers
    SET default_lang = translations.language
    FROM translations
    WHERE translations.river_id = rivers.id
  `);
  await db.schema.alterTable('rivers', (table) => {
    table
      .specificType('default_lang', 'language_code')
      .notNullable()
      .alter();
  });
  await runSqlFile(db, './dist/migrations/038/upsert_river.sql');

  // Sections
  await db.schema.table('sections', (table) => {
    table.specificType('default_lang', 'language_code').nullable();
  });
  await db.raw(`WITH translations AS
    (SELECT DISTINCT ON (section_id) section_id, created_at, language FROM sections_translations ORDER BY section_id, created_at ASC, section_id)
    UPDATE sections
    SET default_lang = translations.language
    FROM translations
    WHERE translations.section_id = sections.id
  `);
  await db.schema.alterTable('sections', (table) => {
    table
      .specificType('default_lang', 'language_code')
      .notNullable()
      .alter();
  });
  await runSqlFile(db, './dist/migrations/038/upsert_section.sql');

  // Media
  await db.schema.table('media', (table) => {
    table.specificType('default_lang', 'language_code').nullable();
  });
  await db.raw(`WITH translations AS
    (SELECT DISTINCT ON (media_id) media_id, created_at, language FROM media_translations ORDER BY media_id, created_at ASC, media_id)
    UPDATE media
    SET default_lang = translations.language
    FROM translations
    WHERE translations.media_id = media.id
  `);
  await db.schema.alterTable('media', (table) => {
    table
      .specificType('default_lang', 'language_code')
      .notNullable()
      .alter();
  });
  await runSqlFile(db, './dist/migrations/038/upsert_section_media.sql');

  await createViews(db, 38, ...VIEWS);
};

export const down = async (db: Knex) => {
  await dropViews(db, ...VIEWS);

  await db.schema.table('sources', (table) => {
    table.dropColumn('default_lang');
  });
  await db.schema.table('gauges', (table) => {
    table.dropColumn('default_lang');
  });
  await db.schema.table('regions', (table) => {
    table.dropColumn('default_lang');
  });
  await db.schema.table('rivers', (table) => {
    table.dropColumn('default_lang');
  });
  await db.schema.table('section', (table) => {
    table.dropColumn('default_lang');
  });
  await db.schema.table('media', (table) => {
    table.dropColumn('default_lang');
  });

  await createViews(db, 37, ...VIEWS);

  await runSqlFile(db, './dist/migrations/031/upsert_source.sql');
  await runSqlFile(db, './dist/migrations/031/upsert_gauges.sql');
  await runSqlFile(db, './dist/migrations/001/upsert_region.sql');
  await runSqlFile(db, './dist/migrations/032/upsert_river.sql');
  await runSqlFile(db, './dist/migrations/037/upsert_section.sql');
  await runSqlFile(db, './dist/migrations/025/upsert_section_media.sql');
};

export const configuration = { transaction: true };
