import { holdTransaction, rollbackTransaction } from '@db';
import { EDITOR_GA_EC, EDITOR_NO_EC, TEST_USER } from '@seeds/01_users';
import { GALICIA_R1_S1 } from '@seeds/09_sections';
import { anonContext, countRows, fakeContext, runQuery } from '@test';

let sBefore: number;
let pBefore: number;
let spBefore: number;
let tBefore: number;

beforeAll(async () => {
  [sBefore, tBefore, pBefore, spBefore] =
    await countRows(true, 'sections', 'sections_translations', 'points', 'sections_points');
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
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.removeSection', null);
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, { id }, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.removeSection', null);
  });

  it('non-owning editor should not pass', async () => {
    const result = await runQuery(query, { id }, fakeContext(EDITOR_NO_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.removeSection', null);
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
    const [sections, translations] = await countRows(false, 'sections', 'sections_translations');
    expect([
      sBefore - sections,
      tBefore - translations,
    ]).toEqual([1, 2]);
  });

  it('should remove points', async () => {
    const [pAfter, spAfter] = await countRows(false, 'points', 'sections_points');
    expect([
      pBefore - pAfter,
      spBefore - spAfter,
    ]).toEqual([2, 2]);
  });

  it.skip('should remove media', async () => {

  });

});
