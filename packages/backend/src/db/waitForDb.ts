/* eslint-disable node/no-process-env */
import retry from 'p-retry';
import pg from 'pg';

import config from './knexfile';

export async function waitForDb(): Promise<void> {
  await retry(
    async () => {
      const cfg = config[process.env.NODE_ENV ?? 'development']();
      const client = new pg.Client({
        ...(cfg.connection as any),
      });
      try {
        await client.connect();
        await client.query('SELECT 1');
      } finally {
        await client.end();
      }
    },
    { factor: 1, retries: 30 },
  );
}
