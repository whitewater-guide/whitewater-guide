import { anonContext, fakeContext } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '~/db';
import {
  ADMIN,
  EDITOR_GE,
  EDITOR_NO,
  EDITOR_NO_EC,
  TEST_USER,
} from '~/seeds/test/01_users';
import { REGION_ECUADOR } from '~/seeds/test/04_regions';
import { RIVER_SJOA } from '~/seeds/test/07_rivers';

import { testChangeRiverRegion } from './changeRiverRegion.test.generated';

const _mutation = gql`
  mutation changeRiverRegion($riverId: ID!, $regionId: ID!) {
    changeRiverRegion(riverId: $riverId, regionId: $regionId) {
      id
      region {
        id
      }
    }
  }
`;

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const variables = { riverId: RIVER_SJOA, regionId: REGION_ECUADOR };

describe('resolvers chain', () => {
  it('anon should fail', async () => {
    const result = await testChangeRiverRegion(variables, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should fail', async () => {
    const result = await testChangeRiverRegion(
      variables,
      fakeContext(TEST_USER),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('should not pass editor who does not own both regions', async () => {
    const result = await testChangeRiverRegion(
      variables,
      fakeContext(EDITOR_NO),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('should not pass editor who does not own river', async () => {
    const result = await testChangeRiverRegion(
      variables,
      fakeContext(EDITOR_GE),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('should pass admin', async () => {
    const result = await testChangeRiverRegion(variables, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
  });
});

describe('result', () => {
  it('should change the region if editor owns both regions', async () => {
    const result = await testChangeRiverRegion(
      variables,
      fakeContext(EDITOR_NO_EC),
    );
    expect(result.errors).toBeUndefined();

    expect(result.data?.changeRiverRegion).toMatchObject({
      id: RIVER_SJOA,
      region: {
        id: REGION_ECUADOR,
      },
    });
  });

  it('should throw exception if region does not exist', async () => {
    const result = await testChangeRiverRegion(
      {
        riverId: RIVER_SJOA,
        regionId: '00000000-0000-0000-0000-000000000000',
      },
      fakeContext(EDITOR_NO_EC),
    );

    expect(result).toHaveGraphqlError(
      ApolloErrorCodes.MUTATION_NOT_ALLOWED,
      'Region does not exist',
    );
  });
});
