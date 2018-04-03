import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { EDITOR_GA_EC, EDITOR_NO_EC } from '../../../seeds/test/01_users';
import { anonContext, fakeContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';

let sectionsBefore: number;
let pointsBefore: number;
let sectionPointsBefore: number;
let translationsBefore: number;

beforeAll(async () => {
  const sections = await db(true).table('sections').count().first();
  sectionsBefore = Number(sections.count);
  const translations = await db(true).table('sections_translations').count().first();
  translationsBefore = Number(translations.count);
  const points = await db(true).table('points').count().first();
  pointsBefore = Number(points.count);
  const sectionsPoints = await db(true).table('sections_points').count().first();
  sectionPointsBefore = Number(sectionsPoints.count);
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  mutation removeSection($id: ID!){
    removeSection(id: $id)
  }
`;

const id = '2b01742c-d443-11e7-9296-cec278b6b50a'; // Galicia River 1 Section 1

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(query, { id }, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.removeSection', null);
  });

  it('user should not pass', async () => {
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
    const sections = await db().table('sections').count().first();
    const translations = await db().table('sections_translations').count().first();
    expect([
      sectionsBefore - Number(sections.count),
      translationsBefore - Number(translations.count),
    ]).toEqual([1, 2]);
  });

  it('should remove points', async () => {
    const points = await db().table('points').count().first();
    const sectionsPoints = await db().table('sections_points').count().first();
    expect([
      pointsBefore - Number(points.count),
      sectionPointsBefore - Number(sectionsPoints.count),
    ]).toEqual([2, 2]);
  });

  it.skip('should remove media', async () => {

  });

});
