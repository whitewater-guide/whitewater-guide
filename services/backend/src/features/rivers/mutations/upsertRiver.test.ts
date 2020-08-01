import db, { holdTransaction, rollbackTransaction } from '~/db';
import { RiverRaw } from '~/features/rivers';
import {
  ADMIN_ID,
  EDITOR_GA_EC,
  EDITOR_GA_EC_ID,
  EDITOR_NO,
  EDITOR_NO_EC,
  TEST_USER,
} from '~/seeds/test/01_users';
import { REGION_GALICIA, REGION_NORWAY } from '~/seeds/test/04_regions';
import { RIVER_GAL_BECA, RIVER_SJOA } from '~/seeds/test/07_rivers';
import {
  anonContext,
  countRows,
  fakeContext,
  isTimestamp,
  isUUID,
  noTimestamps,
  noUnstable,
  runQuery,
} from '~/test';
import { ApolloErrorCodes, RiverInput } from '@whitewater-guide/commons';

let rBefore: number;
let rtBefore: number;

beforeAll(async () => {
  [rBefore, rtBefore] = await countRows(true, 'rivers', 'rivers_translations');
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const upsertQuery = `
  mutation upsertRiver($river: RiverInput!){
    upsertRiver(river: $river){
      id
      name
      altNames
      region {
        id
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
  it('anon should not pass', async () => {
    const result = await runQuery(upsertQuery, { river: input }, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await runQuery(
      upsertQuery,
      { river: input },
      fakeContext(TEST_USER),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('non-owning editor should not pass', async () => {
    const result = await runQuery(
      upsertQuery,
      { river: input },
      fakeContext(EDITOR_NO),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('should throw on invalid input', async () => {
    const invalidInput = {
      id: null,
      name: 'x',
      region: { id: 'aa' },
      altNames: ['x', 'zzz'],
    };
    const result = await runQuery(
      upsertQuery,
      { river: invalidInput },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlValidationError();
  });
});

describe('insert', () => {
  let insertResult: any;
  let insertedRiver: any;

  beforeEach(async () => {
    insertResult = await runQuery(
      upsertQuery,
      { river: input },
      fakeContext(EDITOR_GA_EC),
    );
    insertedRiver =
      insertResult && insertResult.data && insertResult.data.upsertRiver;
  });

  afterEach(() => {
    insertResult = null;
    insertedRiver = null;
  });

  it('should return result', async () => {
    expect(insertResult.errors).toBeUndefined();
    expect(insertResult.data).toBeDefined();
    expect(insertResult.data!.upsertRiver).toBeDefined();
  });

  it('should add one more river', async () => {
    const [rAfter, rtAfter] = await countRows(
      false,
      'rivers',
      'rivers_translations',
    );
    expect(rAfter - rBefore).toBe(1);
    expect(rtAfter - rtBefore).toBe(1);
  });

  it('should return id', () => {
    expect(insertedRiver.id).toBeDefined();
    expect(isUUID(insertedRiver.id)).toBe(true);
  });

  it('should return timestamps', () => {
    expect(insertedRiver.createdAt).toBeDefined();
    expect(insertedRiver.updatedAt).toBeDefined();
    expect(isTimestamp(insertedRiver.createdAt)).toBe(true);
    expect(isTimestamp(insertedRiver.updatedAt)).toBe(true);
  });

  it('should match snapshot', () => {
    expect(noUnstable(insertedRiver)).toMatchSnapshot();
  });

  it('should correctly set created_by', async () => {
    const { created_by } = await db()
      .table('rivers')
      .select(['created_by'])
      .where({ id: insertedRiver.id })
      .first();
    expect(created_by).toBe(EDITOR_GA_EC_ID);
  });
});

describe('update', () => {
  const update: RiverInput = {
    id: RIVER_GAL_BECA,
    name: 'Upsert River',
    altNames: ['upserted', 'oopserted'],
    region: {
      id: REGION_GALICIA,
    },
  };
  let oldRiver: RiverRaw;
  let updateResult: any;
  let updatedRiver: any;

  beforeEach(async () => {
    oldRiver = await db()
      .table('rivers_view')
      .where({ id: update.id })
      .first();
    updateResult = await runQuery(
      upsertQuery,
      { river: update },
      fakeContext(EDITOR_GA_EC),
    );
    updatedRiver =
      updateResult && updateResult.data && updateResult.data.upsertRiver;
  });

  afterEach(() => {
    updateResult = null;
    updatedRiver = null;
  });

  it('should return result', () => {
    expect(updateResult.errors).toBeUndefined();
    expect(updateResult.data).toBeDefined();
    expect(updateResult.data!.upsertRiver).toBeDefined();
  });

  it('should not be able to change region of river', async () => {
    expect(updatedRiver).toHaveProperty('region.id', oldRiver.region_id);
  });

  it('should not change total number of rivers', async () => {
    const [rAfter, rtAfter] = await countRows(
      false,
      'rivers',
      'rivers_translations',
    );
    expect(rAfter - rBefore).toBe(0);
    expect(rtAfter - rtBefore).toBe(0);
  });

  it('should return id', () => {
    expect(updatedRiver.id).toBe(update.id);
  });

  it('should update updated_at timestamp', async () => {
    const { created_at, updated_at } = await db()
      .table('rivers_view')
      .where({ id: update.id })
      .first();
    expect(created_at).toEqual(oldRiver!.created_at);
    expect(updated_at > oldRiver!.updated_at).toBe(true);
  });

  it('should not modify created_by', async () => {
    const { created_by } = await db()
      .table('rivers')
      .select(['created_by'])
      .where({ id: updatedRiver.id })
      .first();
    expect(created_by).toBe(ADMIN_ID);
  });

  it('should match snapshot', () => {
    expect(noTimestamps(updatedRiver)).toMatchSnapshot();
  });
});

describe('i18n', () => {
  it('should add translation', async () => {
    const riverRu = {
      id: 'd69dbabc-bfe3-11e7-abc4-cec278b6b50a',
      name: 'Галисийская река 2',
      region: {
        id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34',
      },
      altNames: ['ГР2', 'Галрек'],
    };
    const upsertResult = await runQuery(
      upsertQuery,
      { river: riverRu },
      fakeContext(EDITOR_GA_EC, 'ru'),
    );
    expect(upsertResult.errors).toBeUndefined();
    const translation = await db()
      .table('rivers_translations')
      .select()
      .where({ river_id: riverRu.id, language: 'ru' })
      .first();
    expect(translation.name).toBe(riverRu.name);
  });

  it('should modify translation', async () => {
    const riverRu = {
      id: 'a8416664-bfe3-11e7-abc4-cec278b6b50a',
      name: 'Галисийская река 1',
      region: {
        id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34',
      },
      altNames: ['ГР1', 'Галрек1'],
    };
    const upsertResult = await runQuery(
      upsertQuery,
      { river: riverRu },
      fakeContext(EDITOR_GA_EC, 'ru'),
    );
    expect(upsertResult.errors).toBeUndefined();
    const translation = await db()
      .table('rivers_translations')
      .select()
      .where({ river_id: riverRu.id, language: 'ru' })
      .first();
    expect(translation).toEqual(
      expect.objectContaining({
        name: 'Галисийская река 1',
        alt_names: ['ГР1', 'Галрек1'],
      }),
    );
  });
});

describe('alt names', () => {
  const riverNullAltNames = { ...input, altNames: null };
  const riverEmptyAltNames = { ...input, altNames: [] };

  it('should create with null altNames', async () => {
    const result = await runQuery(
      upsertQuery,
      { river: riverNullAltNames },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.upsertRiver.altNames', []);
  });

  it('should create with empty array altNames', async () => {
    const result = await runQuery(
      upsertQuery,
      { river: riverEmptyAltNames },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.upsertRiver.altNames', []);
  });

  it('should update with null altNames', async () => {
    const sjoa = {
      ...riverNullAltNames,
      region: { id: REGION_NORWAY },
      id: RIVER_SJOA,
    };
    const result = await runQuery(
      upsertQuery,
      { river: sjoa },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.upsertRiver.altNames', []);
  });

  it('should update with empty array altNames', async () => {
    const sjoa = {
      ...riverEmptyAltNames,
      region: { id: REGION_NORWAY },
      id: RIVER_SJOA,
    };
    const result = await runQuery(
      upsertQuery,
      { river: sjoa },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.upsertRiver.altNames', []);
  });
});

it('should sanitize input', async () => {
  const dirty = { ...input, name: "it's a \\ $1 slash with . ?" };
  const result = await runQuery(
    upsertQuery,
    { river: dirty },
    fakeContext(EDITOR_GA_EC),
  );
  expect(result).toHaveProperty(
    'data.upsertRiver.name',
    "it's a \\ $1 slash with . ?",
  );
});
