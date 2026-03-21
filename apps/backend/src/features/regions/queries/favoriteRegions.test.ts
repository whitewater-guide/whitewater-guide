import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { gql } from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '../../../db/index';
import { TEST_USER } from '../../../seeds/test/01_users';
import { REGION_GALICIA } from '../../../seeds/test/04_regions';
import { fakeContext } from '../../../test/index';
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
    nodes: [{ id: REGION_GALICIA }],
    count: 1,
  });
});
