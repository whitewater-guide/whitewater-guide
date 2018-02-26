import { reseedDb } from './db-helpers';

reseedDb()
  .then(() => {
    console.log('Pretest done');
    process.exit(0);
  })
  .catch((err) => {
    console.log('Pretest failed', err);
    process.exit(1);
  });
