import Knex from 'knex';
import path from 'path';

import { runSqlFile } from '~/db';

/**
 * This migration add psql function to delete sections
 * This allows to transactionally delete river when its last section is deleted
 */
export const up = async (db: Knex) => {
  await runSqlFile(db, path.resolve(__dirname, '034/remove_section.sql'));
};

export const down = async (db: Knex) => {
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS remove_section(section_id UUID) CASCADE',
  );
};

export const configuration = { transaction: true };