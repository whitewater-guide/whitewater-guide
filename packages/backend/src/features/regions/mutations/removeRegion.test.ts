import { holdTransaction, rollbackTransaction } from '../../../db';
import { REGION_ECUADOR, REGION_GALICIA } from '../../../seeds/test/03_regions';
import { adminContext, anonContext, superAdminContext, userContext } from '../../../test/context';
import { countRows } from '../../../test/countRows';
import { runQuery } from '../../../test/db-helpers';

let rpBefore: number;
let rBefore: number;
let rtBefore: number;

beforeAll(async () => {
  [rBefore, rtBefore, rpBefore] = await countRows(true, 'regions', 'regions_translations', 'regions_points');
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  mutation removeRegion($id: ID!){
    removeRegion(id: $id)
  }
`;

const ecuador = { id: REGION_ECUADOR };
const galicia = { id: REGION_GALICIA };

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(query, ecuador, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.removeRegion', null);
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, ecuador, userContext());
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.removeRegion', null);
  });

  it('should not remove non-empty region', async () => {
    const result = await runQuery(query, galicia, superAdminContext());
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('data.removeRegion', null);
  });
});

describe('effects', () => {
  let result: any;

  beforeEach(async () => {
    result = await runQuery(query, ecuador, adminContext());
  });

  afterEach(() => {
    result = null;
  });

  it.only('should return deleted region id', () => {
    expect(result.errors).toBeUndefined();
    expect(result.data.removeRegion).toBe(REGION_ECUADOR);
  });

  it('should remove from tables', async () => {
    const [rAfter, rtAfter, rpAfter] = await countRows(true, 'regions', 'regions_translations', 'regions_points');
    expect([rBefore - rAfter, rtBefore - rtAfter, rpBefore - rpAfter]).toEqual([1, 1, 1]);
  });

});
