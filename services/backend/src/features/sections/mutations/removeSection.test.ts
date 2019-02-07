import db, { holdTransaction, rollbackTransaction } from '@db';
import { SectionsEditLogRaw } from '@features/sections';
import {
  EDITOR_GA_EC,
  EDITOR_GA_EC_ID,
  EDITOR_NO_EC,
  TEST_USER,
} from '@seeds/01_users';
import { REGION_GALICIA } from '@seeds/04_regions';
import { RIVER_GAL_1 } from '@seeds/07_rivers';
import { GALICIA_R1_S1 } from '@seeds/09_sections';
import {
  anonContext,
  countRows,
  fakeContext,
  runQuery,
  UUID_REGEX,
} from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';

let sBefore: number;
let pBefore: number;
let spBefore: number;
let tBefore: number;

beforeAll(async () => {
  [sBefore, tBefore, pBefore, spBefore] = await countRows(
    true,
    'sections',
    'sections_translations',
    'points',
    'sections_points',
  );
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  mutation removeSection($id: ID!){
    removeSection(id: $id)
  }
`;

const id = GALICIA_R1_S1; // Galicia River 1 Section 1

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(query, { id }, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, { id }, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('non-owning editor should not pass', async () => {
    const result = await runQuery(query, { id }, fakeContext(EDITOR_NO_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('effects', () => {
  let result: any;

  beforeEach(async () => {
    result = await runQuery(query, { id }, fakeContext(EDITOR_GA_EC));
  });

  afterEach(() => {
    result = null;
  });

  it('should return delete section id', () => {
    expect(result.errors).toBeUndefined();
    expect(result.data).toHaveProperty('removeSection', id);
  });

  it('should remove section and translation', async () => {
    const [sections, translations] = await countRows(
      false,
      'sections',
      'sections_translations',
    );
    expect([sBefore - sections, tBefore - translations]).toEqual([1, 2]);
  });

  it('should remove points', async () => {
    const [pAfter, spAfter] = await countRows(
      false,
      'points',
      'sections_points',
    );
    expect([pBefore - pAfter, spBefore - spAfter]).toEqual([2, 2]);
  });

  it('should log this event', async () => {
    const entry: SectionsEditLogRaw = await db(false)
      .table('sections_edit_log')
      .orderBy('created_at', 'desc')
      .select('*')
      .first();
    expect(entry).toMatchObject({
      id: expect.stringMatching(UUID_REGEX),
      section_id: id,
      old_section_name: 'Gal_riv_1_sec_1',
      new_section_name: 'Gal_riv_1_sec_1',
      river_id: RIVER_GAL_1,
      river_name: 'Gal_Riv_One',
      region_id: REGION_GALICIA,
      region_name: 'Galicia',
      editor_id: EDITOR_GA_EC_ID,
      action: 'delete',
      created_at: expect.any(Date),
    });
  });

  it.skip('should remove media', async () => {});
});
