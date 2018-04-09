import { pathExists } from 'fs-extra';
import Knex from 'knex';
import { resolve } from 'path';
import log from '../../log';
import { sqlStreamer } from '../../utils/sqlStreamer';

export async function seed(db: Knex) {
  // Dev db is mounted in tmpfs, so we need to seed it after startup
  // But we don't need to reseed it every time when watcher restarts server due to dev file changes
  const dumpFile = resolve(__dirname, 'dump.sql');
  const dumpFileExists = await pathExists(dumpFile);
  if (!dumpFileExists) {
    log.warn(`Could not find dump file '${dumpFile}' to seed from`);
    return;
  }
  const { locked } = await db('seeds_lock').select('*').first();
  if (locked) {
    log.info('Development database is already seeded, check seeds_lock');
    return;
  }
  log.info('Started seeding dev');
  const tables = [
    '"sources_regions"',
    '"logins"',
    '"users"',
    '"gauges"',
    '"gauges_translations"',
    '"groups"',
    '"groups_translations"',
    '"sections"',
    '"sections_translations"',
    '"sections_points"',
    '"sections_tags"',
    '"sections_media"',
    '"sources"',
    '"sources_translations"',
    '"regions"',
    '"regions_translations"',
    '"regions_points"',
    '"regions_editors"',
    '"regions_groups"',
    '"points"',
    '"points_translations"',
    '"rivers"',
    '"rivers_translations"',
    '"tags"',
    '"tags_translations"',
    '"measurements"',
    '"media"',
    '"media_translations"',
  ].join(', ');
  await db.raw(`TRUNCATE ${tables} CASCADE`);

  await new Promise(rslv => {
    const streamer = sqlStreamer(dumpFile);
    streamer.on('finish', () => {
      log.info('Finished seeding dev');
      rslv();
    });
  });

  await db('seeds_lock').update({ locked: true });
  log.info('Locked seeds_lock');
}
