// tslint:disable:no-submodule-imports no-var-requires
// @ts-ignore
require('module-alias/register');
import db from '~/db';

export const reseedDb = async () => {
  let version = '';
  do {
    try {
      await db(true).migrate.rollback();
    } catch (e) {}
    version = await db(true).migrate.currentVersion();
  } while (version !== 'none');
  await db(true).migrate.latest();
  await db(true).seed.run();
};

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
