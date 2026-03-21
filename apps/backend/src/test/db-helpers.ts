import omitDeep from 'omit-deep-lodash';

export const noTimestamps = (row: any) =>
  omitDeep(row, [
    'createdAt',
    'updatedAt',
    'created_at',
    'updated_at',
    'timestamp',
    'startedAt',
    'started_at',
  ]);

export const noUnstable = (row: any) =>
  omitDeep(row, [
    'id',
    'createdAt',
    'updatedAt',
    'created_at',
    'updated_at',
    'timestamp',
    'startedAt',
    'started_at',
  ]);
