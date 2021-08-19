import { anonContext, countRows, fakeContext } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '~/db';
import { TEST_USER } from '~/seeds/test/01_users';
import { GALICIA_BECA_LOWER, NORWAY_SJOA_AMOT } from '~/seeds/test/09_sections';

import { testToggleFavoriteSection } from './toggleFavoriteSection.test.generated';

const _mutation = gql`
  mutation toggleFavoriteSection($id: ID!, $favorite: Boolean!) {
    toggleFavoriteSection(id: $id, favorite: $favorite) {
      id
      favorite
    }
  }
`;

let frBefore: number;

beforeAll(async () => {
  [frBefore] = await countRows(true, 'fav_sections');
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

it('anon should receive error', async () => {
  const result = await testToggleFavoriteSection(
    { id: GALICIA_BECA_LOWER, favorite: true },
    anonContext(),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('should add to favorites', async () => {
  const result = await testToggleFavoriteSection(
    { id: GALICIA_BECA_LOWER, favorite: true },
    fakeContext(TEST_USER),
  );
  expect(result.data?.toggleFavoriteSection).toEqual({
    id: GALICIA_BECA_LOWER,
    favorite: true,
  });
  const [frAfter] = await countRows(false, 'fav_sections');
  expect(frAfter - frBefore).toBe(1);
});

it('should double add to favorites', async () => {
  const result = await testToggleFavoriteSection(
    { id: NORWAY_SJOA_AMOT, favorite: true },
    fakeContext(TEST_USER),
  );
  expect(result.data?.toggleFavoriteSection).toEqual({
    id: NORWAY_SJOA_AMOT,
    favorite: true,
  });
  const [frAfter] = await countRows(false, 'fav_sections');
  expect(frAfter - frBefore).toBe(0);
});

it('should remove from favorites', async () => {
  const result = await testToggleFavoriteSection(
    { id: NORWAY_SJOA_AMOT, favorite: false },
    fakeContext(TEST_USER),
  );
  expect(result.data?.toggleFavoriteSection).toEqual({
    id: NORWAY_SJOA_AMOT,
    favorite: false,
  });
  const [frAfter] = await countRows(false, 'fav_sections');
  expect(frBefore - frAfter).toBe(1);
});
