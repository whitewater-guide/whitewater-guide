import { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN, EDITOR_NO_EC, TEST_USER } from '../../../seeds/test/01_users';
import { NORWAY_SJOA_AMOT } from '../../../seeds/test/09_sections';
import { anonContext, fakeContext } from '../../../test/context';
import { runQuery } from '../../../test/runQuery';

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
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.administrateSection', null);
  });

  it('user should fail', async () => {
    const result = await runQuery(mutation, variables, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.administrateSection', null);
  });

  it('editor should fail', async () => {
    const result = await runQuery(mutation, variables, fakeContext(EDITOR_NO_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.administrateSection', null);
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
