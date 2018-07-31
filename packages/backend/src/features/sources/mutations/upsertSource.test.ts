import db, { holdTransaction, rollbackTransaction } from '@db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '@seeds/01_users';
import { SOURCE_GALICIA_1, SOURCE_GALICIA_2, SOURCE_GEORGIA } from '@seeds/05_sources';
import { anonContext, fakeContext, isTimestamp, isUUID, noTimestamps, noUnstable, runQuery } from '@test';
import { HarvestMode, SourceInput } from '@ww-commons';
import { SourceRaw } from '../types';

let sourceCountBefore: number;

beforeAll(async () => {
  const sourcesCnt = await db(true).table('sources').count().first();
  sourceCountBefore = Number(sourcesCnt.count);
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const requiredSource: SourceInput = {
  id: null,
  name: 'New Source',
  harvestMode: HarvestMode.ALL_AT_ONCE,
  script: 'newScript',
  url: null,
  termsOfUse: null,
  cron: null,
  regions: [{ id: '2caf75ca-7625-11e7-b5a5-be2e44b06b34' }],
};

const optionalSource: SourceInput = {
  id: SOURCE_GALICIA_1,
  name: 'Updated source',
  script: 'updatedScript',
  cron: '1 1 * * *',
  harvestMode: HarvestMode.ONE_BY_ONE,
  url: 'http://google.com',
  termsOfUse: 'New terms of use',
  regions: [{ id: '2caf75ca-7625-11e7-b5a5-be2e44b06b34' }], // replace two regions with one different
};

const mutation = `
  mutation upsertSource($source: SourceInput!){
    upsertSource(source: $source){
      id
      name
      termsOfUse
      script
      cron
      harvestMode
      url
      enabled
      createdAt
      updatedAt
    }
  }
`;

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(mutation, { source: requiredSource }, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.upsertSource', null);
  });

  it('user should not pass', async () => {
    const result = await runQuery(mutation, { source: requiredSource }, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.upsertSource', null);
  });

  it('editor should not pass', async () => {
    const result = await runQuery(mutation, { source: requiredSource }, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.upsertSource', null);
  });

  it('should throw on invalid input', async () => {
    const input: SourceInput = {
      id: 'invalid-input',
      name: 'Invalid source',
      script: 'updatedScript',
      cron: '300 1 * * *',
      harvestMode: HarvestMode.ONE_BY_ONE,
      url: 'not url',
      termsOfUse: 'New terms of use',
      regions: [{ id: 'aaaa' }],
    };
    const result = await runQuery(mutation, { source: input }, fakeContext(ADMIN));
    expect(result).toHaveProperty('errors.0.name', 'ValidationError');
    expect(result.data!.upsertSource).toBeNull();
  });
});

describe('insert', () => {
  let insertResult: any;
  let insertedSource: any;

  beforeEach(async () => {
    insertResult = await runQuery(mutation, { source: requiredSource }, fakeContext(ADMIN));
    insertedSource = insertResult && insertResult.data && insertResult.data.upsertSource;
  });

  afterEach(() => {
    insertResult = null;
    insertedSource = null;
  });

  it('should return result', async () => {
    expect(insertResult.errors).toBeUndefined();
    expect(insertResult.data).toBeDefined();
    expect(insertResult.data!.upsertSource).toBeDefined();
  });

  it('should add one more source', async () => {
    const { count } = await db().table('sources').count().first();
    expect(Number(count) - sourceCountBefore).toBe(1);
  });

  it('should have id', () => {
    expect(insertedSource.id).toBeDefined();
    expect(isUUID(insertedSource.id)).toBe(true);
  });

  it('should have timestamps', () => {
    expect(insertedSource.createdAt).toBeDefined();
    expect(insertedSource.updatedAt).toBeDefined();
    expect(isTimestamp(insertedSource.createdAt)).toBe(true);
    expect(isTimestamp(insertedSource.updatedAt)).toBe(true);
  });

  it('should connect region', async () => {
    const result = await db().table('sources_regions').where({ source_id: insertedSource.id }).count();
    expect(result[0].count).toBe('1');
  });

  it('should match snapshot', () => {
    expect(noUnstable(insertedSource)).toMatchSnapshot();
  });

});

describe('update', () => {
  let oldSource: SourceRaw | null;
  let updateResult: any;
  let updatedSource: any;

  beforeEach(async () => {
    oldSource = await db().table('sources').where({ id: optionalSource.id }).first();
    updateResult = await runQuery(mutation, { source: optionalSource }, fakeContext(ADMIN));
    updatedSource = updateResult && updateResult.data && updateResult.data.upsertSource;
  });

  afterEach(() => {
    updateResult = null;
    updatedSource = null;
    oldSource = null;
  });

  it('should return result', async () => {
    expect(updateResult.errors).toBeUndefined();
    expect(updateResult.data).toBeDefined();
    expect(updateResult.data!.upsertSource).toBeDefined();
  });

  it('should not change total number of sources', async () => {
    const { count } = await db().table('sources').count().first();
    expect(Number(count)).toBe(sourceCountBefore);
  });

  it('should have id', () => {
    expect(updatedSource.id).toBe(optionalSource.id);
  });

  it('should update updated_at timestamp', () => {
    expect(updatedSource.createdAt).toBe(oldSource!.created_at.toISOString());
    expect(new Date(updatedSource.updatedAt).valueOf()).toBeGreaterThan(oldSource!.updated_at.valueOf());
  });

  it('should update connected regions', async () => {
    const result = await db().table('sources_regions').where({ source_id: optionalSource.id }).select('*');
    expect(result).toEqual([{ source_id: optionalSource.id, region_id: '2caf75ca-7625-11e7-b5a5-be2e44b06b34' }]);
  });

  it('should not change enabled sources', async () => {
    const result = await runQuery(
      mutation,
      { source: { ...optionalSource, id: SOURCE_GALICIA_2 } },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeDefined();
    expect(result.data!.upsertSource).toBeNull();
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('errors.0.message', 'Disable source before editing it');
  });

  it('should match snapshot', () => {
    expect(noTimestamps(updatedSource)).toMatchSnapshot();
  });

});

describe('i18n', () => {
  const georgiaRu = {
    id: SOURCE_GEORGIA,
    script: 'georgia',
    name: 'Грузия',
    termsOfUse: 'Правила пользования Грузией',
    cron: '0 * * * *',
    harvestMode: HarvestMode.ONE_BY_ONE,
    url: 'http://georgia.ge',
    regions: [],
  };

  const galiciaRu = {
    id: '6d0d717e-aa9d-11e7-abc4-cec278b6b50a',
    script: 'galicia',
    cron: '0 * * * *',
    harvestMode: HarvestMode.ALL_AT_ONCE,
    url: 'http://ya.ru',
    name: 'Новая Галисия',
    termsOfUse: 'Правила пользования новой галисией',
    regions: [],
  };

  it('should add new translation', async () => {
    const result = await runQuery(mutation, { source: georgiaRu }, fakeContext(ADMIN, 'ru'));
    expect(result.errors).toBeUndefined();
    expect(result.data!.upsertSource).toMatchObject({
      id: SOURCE_GEORGIA,
      name: 'Грузия',
    });
    const translation = await db().table('sources_translations').select()
      .where({ source_id: SOURCE_GEORGIA, language: 'ru' })
      .first();
    expect(translation.name).toBe('Грузия');
  });

  it('should modify common props in other language', async () => {
    await runQuery(mutation, { source: georgiaRu }, fakeContext(ADMIN, 'ru'));
    const commons = await db().table('sources').select('cron')
      .where({ id: SOURCE_GEORGIA }).first();
    expect(commons.cron).toBe(georgiaRu.cron);
  });

  it('should modify translation', async () => {
    const result = await runQuery(mutation, { source: galiciaRu }, fakeContext(ADMIN, 'ru'));
    expect(result.errors).toBeUndefined();
    expect(result.data!.upsertSource).toMatchObject({
      id: SOURCE_GALICIA_1,
      name: 'Новая Галисия',
      termsOfUse: 'Правила пользования новой галисией',
    });
    const translation = await db().table('sources_translations').select()
      .where({ source_id: SOURCE_GALICIA_1, language: 'ru' })
      .first();
    expect(translation).toMatchObject({
      source_id: SOURCE_GALICIA_1,
      name: 'Новая Галисия',
      terms_of_use: 'Правила пользования новой галисией',
    });
  });
});

it('should sanitize input', async () => {
  const dirty = { ...requiredSource, name: "it's a \\ $1 slash with . ?" };
  const result = await runQuery(mutation, { source: dirty }, fakeContext(ADMIN));
  expect(result).toHaveProperty('data.upsertSource.name', "it's a \\ $1 slash with . ?");
});
