import {
  OTHERS_REGION_ID,
  RegionInput,
  SuggestionStatus,
} from '@whitewater-guide/commons';
import Knex from 'knex';
import path from 'path';

import { createViews, dropViews, rawUpsert, runSqlFile } from '~/db';

import { createTable } from './utils';

const VIEWS = ['gauges', 'sections'];

/**
 * This patch removes suggested sections table and adds 'verified' attribute to sections instead
 * It also add 'others' region where all the logbook sections without region are dumped
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  await db.schema.dropTableIfExists('suggested_sections');

  await dropViews(db, ...VIEWS);
  await db.schema.table('sections', (table) => {
    table.boolean('verified');
  });
  await db.table('sections').update({ verified: true });
  await createViews(db, 37, ...VIEWS);
  await runSqlFile(db, path.resolve(__dirname, '037/upsert_section.sql'));

  const othersRegion: RegionInput = {
    id: OTHERS_REGION_ID,
    name: 'Others',
    description: null,
    pois: [],
    season: null,
    seasonNumeric: [],
    bounds: [
      [-179, -89, 0],
      [-179, 89, 0],
      [179, 89, 0],
      [179, -89, 0],
    ],
  };

  await rawUpsert(db, 'SELECT upsert_region(?, ?)', [othersRegion, 'en']);

  await db.raw(
    `
    INSERT INTO regions_groups (region_id, group_id)
    SELECT ?, id
    FROM groups
    WHERE all_regions = TRUE
    LIMIT 1
    ON CONFLICT DO NOTHING
  `,
    OTHERS_REGION_ID,
  );
};

export const down = async (db: Knex) => {
  await db.delete().from('regions').where({ id: OTHERS_REGION_ID });
  await createTable(db, 'suggested_sections', (table) => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table.string('status').notNullable().defaultTo(SuggestionStatus.PENDING);
    table
      .uuid('resolved_by')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamp('resolved_at');
    table.timestamp('created_at').notNullable().defaultTo(db.fn.now());
    table.jsonb('section');
  });

  await dropViews(db, ...VIEWS);
  await db.schema.table('sections', (table) => {
    table.dropColumn('verified');
  });
  await createViews(db, 36, ...VIEWS);
  await runSqlFile(db, path.resolve(__dirname, '033/upsert_section.sql'));
};

export const configuration = { transaction: true };
