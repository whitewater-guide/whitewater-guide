import { holdTransaction, rollbackTransaction } from '@db';
import { ADMIN, EDITOR_NO_EC, TEST_USER } from '@seeds/01_users';
import { NORWAY_SJOA_AMOT } from '@seeds/09_sections';
import { anonContext, fakeContext, runQuery } from '@test';
import { ApolloErrorCodes } from '@ww-commons';

const mutation = `
  mutation administrateSection($sectionId: ID!, $settings: SectionAdminSettings!){
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
    const result = await runQuery(mutation, variables, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should fail', async () => {
    const result = await runQuery(mutation, variables, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should fail', async () => {
    const result = await runQuery(mutation, variables, fakeContext(EDITOR_NO_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

});

describe('result', () => {
  it('should return result', async () => {
    const result = await runQuery(mutation, variables, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.administrateSection).toMatchObject({
      id: NORWAY_SJOA_AMOT,
      demo: true,
    });
  });

});
