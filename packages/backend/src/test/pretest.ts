// @ts-ignore
require('module-alias/register');

import { reseedDb } from './db-helpers';

reseedDb()
  .then(() => {
    // tslint:disable-next-line:no-console
    console.log('Pretest done');
    process.exit(0);
  })
  .catch((err) => {
    // tslint:disable-next-line:no-console
    console.log('Pretest failed', err);
    process.exit(1);
  });
