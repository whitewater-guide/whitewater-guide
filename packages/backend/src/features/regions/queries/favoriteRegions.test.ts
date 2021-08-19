import { fakeContext } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '~/db';
import { TEST_USER } from '~/seeds/test/01_users';
import { REGION_GEORGIA } from '~/seeds/test/04_regions';

import { testFavoriteRegions } from './favoriteRegions.test.generated';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _query = gql`
  query favoriteRegions {
    favoriteRegions {
      nodes {
        id
      }
      count
    }
  }
`;

it('should return error to anons', async () => {
  const res = await testFavoriteRegions();
  expect(res).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('should return ids to user', async () => {
  const res = await testFavoriteRegions(undefined, fakeContext(TEST_USER));
  expect(res.data?.favoriteRegions).toEqual({
    nodes: [{ id: REGION_GEORGIA }],
    count: 1,
  });
});
