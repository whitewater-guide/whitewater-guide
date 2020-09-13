import { anonContext, fakeContext, runQuery } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';

import { holdTransaction, rollbackTransaction } from '~/db';
import { BOOM_USER_3500 } from '~/seeds/test/01_users';
import {
  BOOM_PROMO_ALL_REGIONS_ACTIVE,
  BOOM_PROMO_EU_CIS_ACTIVE,
  BOOM_PROMO_REGION_REDEEMED,
} from '~/seeds/test/12_boom_promos';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query checkBoomPromo($code: String!){
    checkBoomPromo(code: $code) {
      id
      code
      groupName
      groupSku
      redeemed
    }
  }
`;

it('anon shall not pass', async () => {
  const result = await runQuery(
    query,
    { code: BOOM_PROMO_ALL_REGIONS_ACTIVE },
    anonContext(),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('should return null for bad code', async () => {
  const result = await runQuery(
    query,
    { code: 'foobar' },
    fakeContext(BOOM_USER_3500),
  );
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.checkBoomPromo', null);
});

it('should return result for group code', async () => {
  const result = await runQuery(
    query,
    { code: BOOM_PROMO_EU_CIS_ACTIVE },
    fakeContext(BOOM_USER_3500),
  );
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.checkBoomPromo', {
    id: BOOM_PROMO_EU_CIS_ACTIVE,
    code: BOOM_PROMO_EU_CIS_ACTIVE,
    groupName: 'Europe & CIS',
    groupSku: 'group.eu_cis',
    redeemed: false,
  });
});

it('should return result for one-region code', async () => {
  const result = await runQuery(
    query,
    { code: BOOM_PROMO_REGION_REDEEMED },
    fakeContext(BOOM_USER_3500),
  );
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.checkBoomPromo', {
    id: BOOM_PROMO_REGION_REDEEMED,
    code: BOOM_PROMO_REGION_REDEEMED,
    groupName: null,
    groupSku: null,
    redeemed: true,
  });
});

it('should i18nize', async () => {
  const result = await runQuery(
    query,
    { code: BOOM_PROMO_EU_CIS_ACTIVE },
    fakeContext(BOOM_USER_3500, 'ru'),
  );
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.checkBoomPromo', {
    id: BOOM_PROMO_EU_CIS_ACTIVE,
    code: BOOM_PROMO_EU_CIS_ACTIVE,
    groupName: 'Европа и СНГ',
    groupSku: 'group.eu_cis',
    redeemed: false,
  });
});
