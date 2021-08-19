import { fakeContext } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '~/db';
import { TEST_USER } from '~/seeds/test/01_users';
import { REGION_NORWAY } from '~/seeds/test/04_regions';
import {
  NORWAY_SJOA_AMOT,
  RUSSIA_MZYMTA_PASEKA,
} from '~/seeds/test/09_sections';

import { testFavoriteSections } from './favoriteSections.test.generated';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _query = gql`
  query favoriteSections($regionId: ID) {
    favoriteSections(regionId: $regionId) {
      nodes {
        id
      }
      count
    }
  }
`;

it('should return error to anons', async () => {
  const res = await testFavoriteSections();
  expect(res).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('should return ids to user', async () => {
  const res = await testFavoriteSections(undefined, fakeContext(TEST_USER));
  expect(res.data?.favoriteSections).toEqual({
    nodes: [{ id: NORWAY_SJOA_AMOT }, { id: RUSSIA_MZYMTA_PASEKA }],
    count: 2,
  });
});

it('should filter by region', async () => {
  const res = await testFavoriteSections(
    { regionId: REGION_NORWAY },
    fakeContext(TEST_USER),
  );
  expect(res.data?.favoriteSections).toEqual({
    nodes: [{ id: NORWAY_SJOA_AMOT }],
    count: 1,
  });
});
