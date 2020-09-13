import db from '~/db';

import { prepareMinio } from './minio';

export const reseedDb = async () => {
  let version = '';
  do {
    try {
      await db(true).migrate.rollback();
    } catch (e) {
      /* Ignnore */
    }
    version = await db(true).migrate.currentVersion();
  } while (version !== 'none');
  await db(true).migrate.latest();
  await db(true).seed.run();
};

console.info('Begin pretest');
Promise.all([reseedDb(), prepareMinio(true)])
  .then(() => {
    console.info('Pretest done');
    process.exit(0);
  })
  .catch((err) => {
    console.info('Pretest failed', err);
    process.exit(1);
  });
