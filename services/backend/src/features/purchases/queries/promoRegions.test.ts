import { holdTransaction, rollbackTransaction } from '~/db';
import {
  BOOM_USER_1500,
  BOOM_USER_3500,
  EDITOR_NO_EC,
  TEST_USER,
  TEST_USER2,
} from '~/seeds/test/01_users';
import {
  REGION_ECUADOR,
  REGION_GEORGIA,
  REGION_NORWAY,
} from '~/seeds/test/04_regions';
import { anonContext, fakeContext, runQuery } from '~/test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';

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
  const result = await runQuery(query, {}, anonContext());
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('should return all premium regions for user without purchases', async () => {
  const result = await runQuery(query, {}, fakeContext(EDITOR_NO_EC));
  expect(result.errors).toBeUndefined();
  expect(result.data!.promoRegions).toHaveLength(2); // ecuador, georgia
});

it('should not include hidden regions', async () => {
  const result = await runQuery(query, {}, fakeContext(TEST_USER2));
  expect(result.errors).toBeUndefined();
  expect(result.data!.promoRegions).not.toContainEqual(
    expect.objectContaining({ id: REGION_NORWAY }),
  );
});

it('should return empty array for users who purchased all regions group', async () => {
  const result = await runQuery(query, {}, fakeContext(BOOM_USER_3500));
  expect(result.errors).toBeUndefined();
  expect(result.data!.promoRegions).toHaveLength(0);
});

it('should exclude regions purchased as single regions', async () => {
  const result = await runQuery(query, {}, fakeContext(TEST_USER));
  expect(result.errors).toBeUndefined();
  expect(result.data!.promoRegions).toHaveLength(1); // Only ecuador
  expect(result.data!.promoRegions).toContainEqual(
    expect.objectContaining({ id: REGION_ECUADOR }),
  );
  expect(result.data!.promoRegions).not.toContainEqual(
    expect.objectContaining({ id: REGION_GEORGIA }),
  );
});

it('should exclude regions purchased as part of group', async () => {
  const result = await runQuery(query, {}, fakeContext(BOOM_USER_1500));
  expect(result.errors).toBeUndefined();
  expect(result.data!.promoRegions).toHaveLength(1);
  expect(result.data!.promoRegions).not.toContainEqual(
    expect.objectContaining({ id: REGION_GEORGIA }),
  );
  expect(result.data!.promoRegions).not.toContainEqual(
    expect.objectContaining({ id: REGION_NORWAY }),
  );
});

it('should include regions for which transactions are failed', async () => {
  const result = await runQuery(query, {}, fakeContext(TEST_USER));
  expect(result.errors).toBeUndefined();
  expect(result.data!.promoRegions).toContainEqual(
    expect.objectContaining({ id: REGION_ECUADOR }),
  );
});

it('should i18nize', async () => {
  const result = await runQuery(query, {}, fakeContext(EDITOR_NO_EC, 'ru'));
  expect(result.data!.promoRegions).toContainEqual(
    expect.objectContaining({ name: 'Грузия' }),
  );
});
