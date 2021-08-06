import { anonContext, fakeContext } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '~/db';
import {
  ADMIN,
  EDITOR_GA_EC,
  EDITOR_GA_EC_ID,
  EDITOR_NO_EC_ID,
  TEST_USER,
} from '~/seeds/test/01_users';
import { REGION_ECUADOR, REGION_GALICIA } from '~/seeds/test/04_regions';

import { testRegionEditors } from './regionEditors.test.generated';

const _q = gql`
  query regionEditors($regionId: ID!) {
    regionEditors(regionId: $regionId) {
      id
      name
      email
    }
  }
`;

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  const variables = { regionId: REGION_GALICIA };

  it('anon should fail', async () => {
    const result = await testRegionEditors(variables, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should fail', async () => {
    const result = await testRegionEditors(variables, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should fail', async () => {
    const result = await testRegionEditors(
      variables,
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('results', () => {
  it('should find one', async () => {
    const result = await testRegionEditors(
      { regionId: REGION_GALICIA },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.regionEditors).toHaveLength(1);
    expect(result.data?.regionEditors).toMatchObject([{ id: EDITOR_GA_EC_ID }]);
  });

  it('should find many', async () => {
    const result = await testRegionEditors(
      { regionId: REGION_ECUADOR },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.regionEditors).toHaveLength(2);
    expect(result.data?.regionEditors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: EDITOR_GA_EC_ID }),
        expect.objectContaining({ id: EDITOR_NO_EC_ID }),
      ]),
    );
  });
});
