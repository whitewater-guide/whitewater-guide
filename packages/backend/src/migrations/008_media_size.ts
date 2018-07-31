import { createViews, dropViews, runSqlFile } from '@db';
import { MEDIA, minioClient } from '@minio';
import Knex from 'knex';
import { BucketItem } from 'minio';

const VIEWS = ['media'];

/**
 * This patch adds cover file size column to media
 */
export const up = async (db: Knex) => {
  // Need to drop views first
  await dropViews(db, ...VIEWS);

  // Add cover image
  await db.schema.table('media', (table) => {
    table.integer('size').notNullable().defaultTo(0);
  });
  await setFileSizes(db);

  await createViews(db, 8, ...VIEWS);
  await runSqlFile(db, './src/migrations/008/upsert_section_media.sql');
};

export const down = async (db: Knex) => {
  await dropViews(db, ...VIEWS);

  await db.schema.table('media', (table) => {
    table.dropColumn('size');
  });

  await createViews(db, 7, ...VIEWS);
  await runSqlFile(db, './src/migrations/001/upsert_section_media.sql');
};

type BucketFile = Pick<BucketItem, 'name' | 'size'>;

function readFiles(): Promise<BucketFile[]> {
  return new Promise((resolve) => {
    const files: BucketFile[] = [];
    minioClient.listObjectsV2(MEDIA)
      .on('data', ({ name, size }) => files.push({ name, size }))
      .on('end' as any, () => resolve(files));
  });
}

async function setFileSizes(db: Knex) {
  await db.raw('CREATE TEMP TABLE media_files (name varchar, size integer)');
  const files = await readFiles();
  await db.table('media_files').insert(files);
  // Knex doesn't support UPDATE FROM: https://github.com/tgriesser/knex/issues/557
  await db.raw(`UPDATE "media"
                SET "size" = "media_files"."size"
                FROM "media_files"
                WHERE "media"."url" = "media_files"."name"
  `);
  await db.raw('DROP TABLE media_files');
}

export const configuration = { transaction: true };