import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { adminContext, anonContext, userContext } from '../../../test/context';
import { isTimestamp, isUUID, noTimestamps, noUnstable, runQuery } from '../../../test/db-helpers';
import { RiverInput } from '../../../ww-commons';
import { RiverRaw } from '../../rivers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const upsertQuery = `
  mutation upsertRiver($river: RiverInput!, $language: String){
    upsertRiver(river: $river, language: $language){
      id
      language
      name
      altNames
      region {
        id
        language
        name
      }
      createdAt
      updatedAt
    }
  }
`;

const input: RiverInput = {
  id: null,
  name: 'Upsert River',
  altNames: ['upserted', 'oopserted'],
  region: {
    id: '2caf75ca-7625-11e7-b5a5-be2e44b06b34', // Ecuador
  },
};

describe('resolvers chain', () => {
  test('anon should not pass', async () => {
    const result = await runQuery(upsertQuery, { river: input }, anonContext);
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.upsertRiver', null);
  });

  test('user should not pass', async () => {
    const result = await runQuery(upsertQuery, { river: input }, userContext);
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.upsertRiver', null);
  });

  test('should throw on invalid input', async () => {
    const invalidInput = {
      id: null,
      name: 'x',
      region: { id: 'aa' },
      altNames: ['x', 'zzz'],
    };
    const result = await runQuery(upsertQuery, { river: invalidInput }, adminContext);
    expect(result).toHaveProperty('errors.0.name', 'ValidationError');
    expect(result.data).toBeDefined();
    expect(result.data!.upsertRiver).toBeNull();
    expect((result.errors![0] as any).data).toMatchSnapshot();
  });
});

describe('insert', () => {
  let insertResult: any;
  let insertedRiver: any;

  beforeEach(async () => {
    insertResult = await runQuery(upsertQuery, { river: input }, adminContext);
    insertedRiver = insertResult && insertResult.data && insertResult.data.upsertRiver;
  });

  afterEach(() => {
    insertResult = null;
    insertedRiver = null;
  });

  test('should return result', async () => {
    expect(insertResult.errors).toBeUndefined();
    expect(insertResult.data).toBeDefined();
    expect(insertResult.data!.upsertRiver).toBeDefined();
  });

  test('should add one more river', async () => {
    const { count } = await db().table('rivers').count().first();
    expect(count).toBe('5');
  });

  test('should return id', () => {
    expect(insertedRiver.id).toBeDefined();
    expect(isUUID(insertedRiver.id)).toBe(true);
  });

  test('should return timestamps', () => {
    expect(insertedRiver.createdAt).toBeDefined();
    expect(insertedRiver.updatedAt).toBeDefined();
    expect(isTimestamp(insertedRiver.createdAt)).toBe(true);
    expect(isTimestamp(insertedRiver.updatedAt)).toBe(true);
  });

  test('should match snapshot', () => {
    expect(noUnstable(insertedRiver)).toMatchSnapshot();
  });
});

describe('update', () => {
  const update = { ...input, id: 'a8416664-bfe3-11e7-abc4-cec278b6b50a' }; // Gal_rive_one
  let oldRiver: RiverRaw;
  let updateResult: any;
  let updatedRiver: any;

  beforeEach(async () => {
    oldRiver = await db().table('rivers_view').where({ id: update.id }).first();
    updateResult = await runQuery(upsertQuery, { river: update }, adminContext);
    updatedRiver = updateResult && updateResult.data && updateResult.data.upsertRiver;
  });

  afterEach(() => {
    updateResult = null;
    updatedRiver = null;
  });

  test('should return result', () => {
    expect(updateResult.errors).toBeUndefined();
    expect(updateResult.data).toBeDefined();
    expect(updateResult.data!.upsertRiver).toBeDefined();
  });

  test('should not be able to change region of river', async () => {
    expect(updatedRiver).toHaveProperty('region.id', oldRiver.region_id);
  });

  test('should not change total number of rivers', async () => {
    const { count } = await db().table('rivers').count().first();
    expect(count).toBe('4');
  });

  test('should return id', () => {
    expect(updatedRiver.id).toBe(update.id);
  });

  test('should update updated_at timestamp', () => {
    expect(updatedRiver.createdAt).toBe(oldRiver!.created_at.toISOString());
    expect(new Date(updatedRiver.updatedAt).valueOf()).toBeGreaterThan(oldRiver!.updated_at.valueOf());
  });

  test('should match snapshot', () => {
    expect(noTimestamps(updatedRiver)).toMatchSnapshot();
  });
});

describe('i18n', () => {

  test('should add translation', async () => {
    const riverRu = {
      id: 'd69dbabc-bfe3-11e7-abc4-cec278b6b50a',
      name: 'Галисийская река 2',
      region: {
        id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34',
      },
      altNames: ['ГР2', 'Галрек'],
    };
    const upsertResult = await runQuery(upsertQuery, { river: riverRu, language: 'ru' }, adminContext);
    expect(upsertResult.errors).toBeUndefined();
    const translation = await db().table('rivers_translations').select()
      .where({ river_id: riverRu.id, language: 'ru' }).first();
    expect(translation.name).toBe(riverRu.name);
  });

  test('should modify translation', async () => {
    const riverRu = {
      id: 'a8416664-bfe3-11e7-abc4-cec278b6b50a',
      name: 'Галисийская река 1',
      region: {
        id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34',
      },
      altNames: ['ГР1', 'Галрек1'],
    };
    const upsertResult = await runQuery(upsertQuery, { river: riverRu, language: 'ru' }, adminContext);
    expect(upsertResult.errors).toBeUndefined();
    const translation = await db().table('rivers_translations').select()
      .where({ river_id: riverRu.id, language: 'ru' }).first();
    expect(translation).toEqual(expect.objectContaining({
      name: 'Галисийская река 1',
      alt_names: ['ГР1', 'Галрек1'],
    }));
  });

});

describe('alt names', () => {
  const riverNullAltNames = { ...input, altNames: null };
  const riverEmptyAltNames = { ...input, altNames: [] };

  it('should create with null altNames', async () => {
    const result = await runQuery(upsertQuery, { river: riverNullAltNames }, adminContext);
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.upsertRiver.altNames', []);
  });

  it('should create with empty array altNames', async () => {
    const result = await runQuery(upsertQuery, { river: riverEmptyAltNames }, adminContext);
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.upsertRiver.altNames', []);
  });

  it('should update with null altNames', async () => {
    const sjoa = { ...riverNullAltNames, id: 'd4396dac-d528-11e7-9296-cec278b6b50a' };
    const result = await runQuery(upsertQuery, { river: sjoa }, adminContext);
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.upsertRiver.altNames', []);
  });

  it('should update with empty array altNames', async () => {
    const sjoa = { ...riverEmptyAltNames, id: 'd4396dac-d528-11e7-9296-cec278b6b50a' };
    const result = await runQuery(upsertQuery, { river: sjoa }, adminContext);
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.upsertRiver.altNames', []);
  });
});
