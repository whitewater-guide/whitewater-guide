import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { adminContext, anonContext, userContext } from '../../../test/context';
import { isTimestamp, isUUID, noTimestamps, noUnstable, runQuery, } from '../../../test/db-helpers';
import { SourceInput } from '../../../ww-commons';
import { HarvestMode, SourceRaw } from '../types';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const requiredSource: SourceInput = {
  name: 'New Source',
  harvestMode: HarvestMode.ALL_AT_ONCE,
  script: 'newScript',
};

const optionalSource: SourceInput = {
  id: 'b28f728a-6efa-11e7-96fe-47a2910087ec',
  name: 'Updated source',
  script: 'updatedScript',
  cron: '1 1 * * *',
  harvestMode: HarvestMode.ONE_BY_ONE,
  url: 'http://google.com',
  termsOfUse: 'New terms of use',
};

const upsertQuery = `
  mutation upsertSource($source: SourceInput!){
    upsertSource(source: $source){
      id
      name
      termsOfUse
      script
      cron
      harvestMode
      url
      createdAt
      updatedAt
    }
  }
`;

describe('resolvers chain', () => {
  test('anon should not pass', async () => {
    const result = await runQuery(upsertQuery, { source: requiredSource }, anonContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.upsertSource).toBeNull();
    expect(result).toMatchSnapshot();
  });

  test('user should not pass', async () => {
    const result = await runQuery(upsertQuery, { source: requiredSource }, userContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.upsertSource).toBeNull();
    expect(result).toMatchSnapshot();
  });

  test('should throw on invalid input', async () => {
    const input = {
      id: 'invalid-input',
      name: 'Invalid source',
      script: 'updatedScript',
      cron: '300 1 * * *',
      harvestMode: HarvestMode.ONE_BY_ONE,
      url: 'not url',
      termsOfUse: 'New terms of use',
    };
    const result = await runQuery(upsertQuery, { source: input }, adminContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.upsertSource).toBeNull();
    expect(result).toMatchSnapshot();
  });
});

describe('insert', () => {
  let insertResult: any;
  let insertedSource: any;

  beforeEach(async () => {
    insertResult = await runQuery(upsertQuery, { source: requiredSource }, adminContext);
    insertedSource = insertResult && insertResult.data && insertResult.data.upsertSource;
  });

  afterEach(() => {
    insertResult = null;
    insertedSource = null;
  });

  test('should return result', async () => {
    expect(insertResult.errors).toBeUndefined();
    expect(insertResult.data).toBeDefined();
    expect(insertResult.data!.upsertSource).toBeDefined();
  });

  test('should add one more source', async () => {
    const result = await db().table('sources').count();
    expect(result[0].count).toBe('3');
  });

  test('should have id', () => {
    expect(insertedSource.id).toBeDefined();
    expect(isUUID(insertedSource.id)).toBe(true);
  });

  test('should have timestamps', () => {
    expect(insertedSource.createdAt).toBeDefined();
    expect(insertedSource.updatedAt).toBeDefined();
    expect(isTimestamp(insertedSource.createdAt)).toBe(true);
    expect(isTimestamp(insertedSource.updatedAt)).toBe(true);
  });

  test('should match snapshot', () => {
    expect(noUnstable(insertedSource)).toMatchSnapshot();
  });

});

describe('update', () => {
  let oldSource: SourceRaw | null;
  let updateResult: any;
  let updatedSource: any;

  beforeEach(async () => {
    oldSource = await db().table('sources').where({ id: optionalSource.id }).first();
    updateResult = await runQuery(upsertQuery, { source: optionalSource }, adminContext);
    updatedSource = updateResult && updateResult.data && updateResult.data.upsertSource;
  });

  afterEach(() => {
    updateResult = null;
    updatedSource = null;
    oldSource = null;
  });

  test('should return result', async () => {
    expect(updateResult.errors).toBeUndefined();
    expect(updateResult.data).toBeDefined();
    expect(updateResult.data!.upsertSource).toBeDefined();
  });

  test('should not change total number of source', async () => {
    const result = await db().table('sources').count();
    expect(result[0].count).toBe('2');
  });

  test('should have id', () => {
    expect(updatedSource.id).toBe(optionalSource.id);
  });

  test('should update updated_at timestamp', () => {
    expect(updatedSource.createdAt).toBe(oldSource!.created_at.toISOString());
    expect(new Date(updatedSource.updatedAt).valueOf()).toBeGreaterThan(oldSource!.updated_at.valueOf());
  });

  test('should match snapshot', () => {
    expect(noTimestamps(updatedSource)).toMatchSnapshot();
  });

});
