/* eslint-disable node/no-process-env */
import { Client } from 'pg';
import waitForExpect from 'wait-for-expect';

import config from './knexfile';

export const waitForDb = async () => {
  return waitForExpect(
    async () => {
      const client = new Client({
        ...(config[process.env.NODE_ENV || 'development']!.connection as any),
      });
      try {
        await client.connect();
        await client.query('SELECT 1');
      } finally {
        await client.end();
      }
    },
    30000,
    1000,
  );
};
