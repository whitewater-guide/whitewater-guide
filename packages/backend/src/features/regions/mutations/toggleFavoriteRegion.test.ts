import { anonContext, countRows, fakeContext } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '~/db';
import { TEST_USER } from '~/seeds/test/01_users';
import { REGION_GALICIA, REGION_RUSSIA } from '~/seeds/test/04_regions';

import { testToggleFavoriteRegion } from './toggleFavoriteRegion.test.generated';

const _mutation = gql`
  mutation toggleFavoriteRegion($id: ID!, $favorite: Boolean!) {
    toggleFavoriteRegion(id: $id, favorite: $favorite) {
      id
      favorite
    }
  }
`;

let frBefore: number;

beforeAll(async () => {
  [frBefore] = await countRows(true, 'fav_regions');
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

it('anon should receive error', async () => {
  const result = await testToggleFavoriteRegion(
    { id: REGION_RUSSIA, favorite: true },
    anonContext(),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('should add to favorites', async () => {
  const result = await testToggleFavoriteRegion(
    { id: REGION_RUSSIA, favorite: true },
    fakeContext(TEST_USER),
  );
  expect(result.data?.toggleFavoriteRegion).toEqual({
    id: REGION_RUSSIA,
    favorite: true,
  });
  const [frAfter] = await countRows(false, 'fav_regions');
  expect(frAfter - frBefore).toBe(1);
});

it('should double add to favorites', async () => {
  const result = await testToggleFavoriteRegion(
    { id: REGION_GALICIA, favorite: true },
    fakeContext(TEST_USER),
  );
  expect(result.data?.toggleFavoriteRegion).toEqual({
    id: REGION_GALICIA,
    favorite: true,
  });
  const [frAfter] = await countRows(false, 'fav_regions');
  expect(frAfter - frBefore).toBe(0);
});

it('should remove from favorites', async () => {
  const result = await testToggleFavoriteRegion(
    { id: REGION_GALICIA, favorite: false },
    fakeContext(TEST_USER),
  );
  expect(result.data?.toggleFavoriteRegion).toEqual({
    id: REGION_GALICIA,
    favorite: false,
  });
  const [frAfter] = await countRows(false, 'fav_regions');
  expect(frBefore - frAfter).toBe(1);
});
