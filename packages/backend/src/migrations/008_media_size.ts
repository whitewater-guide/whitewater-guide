import type { Knex } from 'knex';

import { createViews, dropViews, runSqlFile } from '../db/index';
import { MEDIA, s3Client } from '../s3/index';
import { resolveRelative } from '../utils/index';

const VIEWS = ['media'];

interface BucketFile {
  name: string;
  size: number;
}

async function readFiles(): Promise<BucketFile[]> {
  try {
    const files = await s3Client.listObjects(MEDIA);
    return files.map((f: any) => ({ name: f.name, size: f.size }));
  } catch (e) {
    // this fails in pretest migrations, but it's expected
    return [];
  }
}

async function setFileSizes(db: Knex) {
  await db.raw('CREATE TEMP TABLE media_files (name varchar, size integer)');
  const files = await readFiles();
  if (!files.length) {
    return;
  }
  await db.table('media_files').insert(files);
  // Knex doesn't support UPDATE FROM: https://github.com/tgriesser/knex/issues/557
  await db.raw(`UPDATE "media"
                SET "size" = "media_files"."size"
                FROM "media_files"
                WHERE "media"."url" = "media_files"."name"
  `);
  await db.raw('DROP TABLE media_files');
}

/**
 * This patch adds cover file size column to media
 */
export async function up(db: Knex): Promise<void> {
  // Need to drop views first
  await dropViews(db, ...VIEWS);

  // Add cover image
  await db.schema.table('media', (table) => {
    table.integer('size').notNullable().defaultTo(0);
  });
  await setFileSizes(db);

  await createViews(db, 8, ...VIEWS);
  await runSqlFile(
    db,
    resolveRelative(__dirname, '008/upsert_section_media.sql'),
  );
}

export async function down(db: Knex): Promise<void> {
  await dropViews(db, ...VIEWS);

  await db.schema.table('media', (table) => {
    table.dropColumn('size');
  });

  await createViews(db, 7, ...VIEWS);
  await runSqlFile(
    db,
    resolveRelative(__dirname, '001/upsert_section_media.sql'),
  );
}
