import { anonContext, fakeContext } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '~/db';
import { ADMIN, EDITOR_NO_EC, TEST_USER } from '~/seeds/test/01_users';
import { NORWAY_SJOA_AMOT } from '~/seeds/test/09_sections';

import { testAdministrateSection } from './administrateSection.test.generated';

const _mutation = gql`
  mutation administrateSection(
    $sectionId: ID!
    $settings: SectionAdminSettings!
  ) {
    administrateSection(id: $sectionId, settings: $settings) {
      id
      demo
    }
  }
`;

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const variables = { sectionId: NORWAY_SJOA_AMOT, settings: { demo: true } };

describe('resolvers chain', () => {
  it('anon should fail', async () => {
    const result = await testAdministrateSection(variables, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should fail', async () => {
    const result = await testAdministrateSection(
      variables,
      fakeContext(TEST_USER),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should fail', async () => {
    const result = await testAdministrateSection(
      variables,
      fakeContext(EDITOR_NO_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('result', () => {
  it('should return result', async () => {
    const result = await testAdministrateSection(variables, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data?.administrateSection).toMatchObject({
      id: NORWAY_SJOA_AMOT,
      demo: true,
    });
  });
});
