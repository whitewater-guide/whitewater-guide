import Knex from 'knex';
import { addUpdatedAtTrigger, createViews, dropViews, runSqlFile } from '../db';

const VIEWS = ['groups', 'gauges', 'sections', 'rivers', 'regions', 'points'];
/**
 * This patch adds tables for transactions and boomstarter promo codes
 * Also adds premium attribute to POI
 * And makes SKU unique for groups and regions
 */
export const up = async (db: Knex) => {
  // Never really used this
  await db.raw('DROP TABLE IF EXISTS purchases CASCADE');
  // Need to drop views first
  await dropViews(db, ...VIEWS);

  // Add premium POIS
  await db.schema.table('points', (table) => {
    table.boolean('premium').notNullable().defaultTo(false);
  });

  // Add auto-add column which indicated that regions should be automatically added to this group
  await db.schema.table('groups', (table) => {
    table.boolean('auto_add').notNullable().defaultTo(false);
  });

  // Make sku uniques
  await db.raw('ALTER TABLE groups ADD CONSTRAINT groups_sku_unique UNIQUE (sku)');
  await db.raw('ALTER TABLE regions ADD CONSTRAINT regions_sku_unique UNIQUE (sku)');

  await runSqlFile(db, './src/migrations/004/platform_type.sql');
  await db.schema.createTable('transactions', (table) => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table
      .uuid('user_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL'); // Keep transactions even if user was deleted
    table.specificType('platform', 'platform_type').notNullable().index();
    table.timestamp('transaction_date').notNullable();
    table.string('transaction_id').notNullable();
    table.string('product_id').notNullable();
    table.string('receipt').notNullable();
    table.boolean('validated'); // null, true, or false for invalid
    table.json('extra');
    table.timestamps(false, true);

    table.unique(['platform', 'transaction_id']);
  });

  // Generated promocodes for boomstarter promo campaign
  // If group_sku is null, then this promocode is for single region of choice
  await await db.schema.createTable('boom_promos', (table) => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.string('code').notNullable();
    table.boolean('redeemed').notNullable().defaultTo(false);
    table.string('group_sku')
      .references('sku')
      .inTable('groups');
  });
  await addUpdatedAtTrigger(db, 'transactions');

  await createViews(db, 4, ...VIEWS);
};

export const down = async (db: Knex) => {
  await dropViews(db, ...VIEWS);
  await db.schema.raw('DROP TABLE IF EXISTS transactions CASCADE');
  await db.schema.raw('DROP TYPE IF EXISTS platform_type CASCADE');

  await db.schema.table('groups', (table) => {
    table.dropColumn('auto_add');
  });

  await db.schema.table('points', (table) => {
    table.dropColumn('premium');
  });

  await db.raw('ALTER TABLE groups DROP CONSTRAINT groups_sku_unique');
  await db.raw('ALTER TABLE regions DROP CONSTRAINT regions_sku_unique');
  // Do not recreate purchases table because it was never really used

  await createViews(db, 3, ...VIEWS);
};

export const configuration = { transaction: true };
