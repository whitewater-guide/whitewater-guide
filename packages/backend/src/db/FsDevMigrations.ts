// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { FsMigrations } from 'knex/lib/migrate/sources/fs-migrations';

// When restoring production dump on development, migration names will have '.js' extension
// Therefore, development migrations with '.ts' will conflict them
// this is the workaround
// https://github.com/knex/knex/blob/master/lib/migrate/sources/fs-migrations.js
export class FsDevMigrations extends FsMigrations {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(
    migrationDirectories: string | string[],
    sortDirsSeparately?: boolean,
    loadExtensions?: string[],
  ) {
    super(migrationDirectories, sortDirsSeparately, loadExtensions);
  }

  getMigrationName(migration: any): string {
    return migration.file.replace('.ts', '.js');
  }
}
