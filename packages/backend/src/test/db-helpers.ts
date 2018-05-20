import omitDeep from 'omit-deep-lodash';
import db from '../db';

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

export const disconnect = async () => {
  await db(true).destroy();
};

export const noTimestamps = (row: any) => omitDeep(row, ['createdAt', 'updatedAt', 'created_at', 'updated_at']);

export const noUnstable = (row: any) => omitDeep(row, ['id', 'createdAt', 'updatedAt', 'created_at', 'updated_at']);

export * from './countRows';
export * from './isTimestamp';
export * from './isUUID';
export * from './runQuery';
