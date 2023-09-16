import fs from 'node:fs/promises';
import path from 'node:path';

import type { Knex } from 'knex';

// https://knexjs.org/guide/migrations.html#custom-migration-sources
export default class FsMigrationSource implements Knex.MigrationSource<string> {
  // eslint-disable-next-line node/no-process-env
  private readonly ext = process.env.NODE_ENV === 'production' ? 'js' : 'ts';
  private readonly directory: string;

  constructor(directory: string) {
    this.directory = directory;
  }
  // Must return a Promise containing a list of migrations.
  // Migrations can be whatever you want,
  // they will be passed as arguments to getMigrationName
  // and getMigration
  //
  // In our case migrations are filenames without extension
  async getMigrations(): Promise<string[]> {
    // In this example we are just returning migration names
    const dirContent = await fs.readdir(this.directory);
    // assume that migrations have extensions (== no directories with '.' symbol)
    return dirContent
      .filter((f) => f.includes('.'))
      .map((f) => f.split('.')[0])
      .sort();
  }

  // When restoring production dump on development, migration names will have '.js' extension
  getMigrationName(migration: string): string {
    return migration + '.js';
  }

  async getMigration(migration: string): Promise<Knex.Migration> {
    const moduleName = path.resolve(
      process.cwd(),
      this.directory,
      `${migration}.${this.ext}`,
    );
    return import(moduleName);
  }
}
