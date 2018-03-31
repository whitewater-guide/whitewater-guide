import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { adminContext, anonContext, userContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';

const query = `
  mutation removeRegion($id: ID!){
    removeRegion(id: $id)
  }
`;

const galicia = { id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34' };

let riversBefore: number;
let sectionsBefore: number;
let pointsBefore: number;
let regionPointsBefore: number;
let sectionPointsBefore: number;

beforeAll(async () => {
  const rivers = await db(true).table('rivers').count().first();
  riversBefore = Number(rivers.count);
  const points = await db(true).table('points').count().first();
  pointsBefore = Number(points.count);
  const sections = await db(true).table('sections').count().first();
  sectionsBefore = Number(sections.count);
  const sectionsPoints = await db(true).table('sections_points').count().first();
  sectionPointsBefore = Number(sectionsPoints.count);
  const regionsPoints = await db(true).table('regions_points').count().first();
  regionPointsBefore = Number(regionsPoints.count);
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  test('anon should not pass', async () => {
    const result = await runQuery(query, galicia, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.removeRegion', null);
  });

  test('user should not pass', async () => {
    const result = await runQuery(query, galicia, userContext());
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.removeRegion', null);
  });
});

describe('effects', () => {
  let result: any;

  beforeEach(async () => {
    result = await runQuery(query, galicia, adminContext());
  });

  afterEach(() => {
    result = null;
  });

  test('should return deleted region id', () => {
    expect(result.data.removeRegion).toBe(galicia.id);
  });

  test('should remove from regions table', async () => {
    const count = await db().table('regions').count().first();
    expect(count.count).toBe('2');
  });

  test('should remove from regions translation table', async () => {
    const count = await db().table('regions_translations').count().first();
    expect(count.count).toBe('2');
  });

  test('should remove pois', async () => {
    const points = await db().table('points').count().first();
    const regionsPoints = await db().table('regions_points').count().first();
    expect([
      pointsBefore - Number(points.count),
      regionPointsBefore - Number(regionsPoints.count),
    ]).toEqual([4, 2]); // 4 - including sections points
  });

  test('should remove rivers', async () => {
    const rivers = await db().table('rivers').count().first();
    expect(riversBefore - Number(rivers.count)).toBe(2);
  });

  test('should remove sections', async () => {
    const sections = await db().table('sections').count().first();
    expect(sectionsBefore - Number(sections.count)).toBe(2);
  });

  test('should remove section pois', async () => {
    const sectionsPoints = await db().table('sections_points').count().first();
    expect(sectionPointsBefore - Number(sectionsPoints.count)).toBe(2);
  });

  test.skip('should remove section media', async () => {

  });
});
