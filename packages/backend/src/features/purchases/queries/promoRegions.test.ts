import { holdTransaction, rollbackTransaction } from '../../../db';
import { BOOM_USER_1500, BOOM_USER_3500, EDITOR_NO_EC, TEST_USER } from '../../../seeds/test/01_users';
import { REGION_GEORGIA, REGION_NORWAY } from '../../../seeds/test/04_regions';
import { anonContext, fakeContext } from '../../../test/context';
import { runQuery } from '../../../test/runQuery';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query promoRegions {
    promoRegions {
      id
      name
    }
  }
`;

it('anon shall not pass', async () => {
  const result = await runQuery(query, { }, anonContext());
  expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
  expect(result).toHaveProperty('data.promoRegions', null);
});

it('should return all premium regions for user without purchases', async () => {
  const result = await runQuery(query, { }, fakeContext(EDITOR_NO_EC));
  expect(result.errors).toBeUndefined();
  expect(result.data!.promoRegions).toHaveLength(3); // ecuador, norway, georgia
});

it('should return empty array for users who purchased all regions group', async () => {
  const result = await runQuery(query, { }, fakeContext(BOOM_USER_3500));
  expect(result.errors).toBeUndefined();
  expect(result.data!.promoRegions).toHaveLength(0);
});

it('should exclude regions purchased as single regions', async () => {
  const result = await runQuery(query, { }, fakeContext(TEST_USER));
  expect(result.errors).toBeUndefined();
  expect(result.data!.promoRegions).toHaveLength(2);
  expect(result.data!.promoRegions).not.toContainEqual(expect.objectContaining({ id: REGION_GEORGIA }));
});

it('should exclude regions purchased as part of group', async () => {
  const result = await runQuery(query, { }, fakeContext(BOOM_USER_1500));
  expect(result.errors).toBeUndefined();
  expect(result.data!.promoRegions).toHaveLength(1);
  expect(result.data!.promoRegions).not.toContainEqual(expect.objectContaining({ id: REGION_GEORGIA }));
  expect(result.data!.promoRegions).not.toContainEqual(expect.objectContaining({ id: REGION_NORWAY }));
});

it('should i18nize', async () => {
  const result = await runQuery(query, { }, fakeContext(EDITOR_NO_EC, 'ru'));
  expect(result.data!.promoRegions).toContainEqual(expect.objectContaining({ name: 'Грузия' }));
});
