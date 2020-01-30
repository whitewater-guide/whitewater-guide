import { holdTransaction, rollbackTransaction } from '@db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '@seeds/01_users';
import { SOURCE_GALICIA_1, SOURCE_NORWAY } from '@seeds/05_sources';
import { anonContext, fakeContext, runQuery } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';

jest.mock('../../gorge/connector');

const DATA_FIELD = 'toggleSource';

const query = `
  mutation toggleSource($id: ID!, $enabled: Boolean!){
    toggleSource(id: $id, enabled: $enabled) {
      id
      enabled
    }
  }
`;

const gal1 = { id: SOURCE_GALICIA_1, enabled: true };
const nor = { id: SOURCE_NORWAY, enabled: false };

beforeEach(async () => {
  jest.clearAllMocks();
  await holdTransaction();
});
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(query, gal1, anonContext());
    expect(result).toHaveGraphqlError(
      ApolloErrorCodes.UNAUTHENTICATED,
      DATA_FIELD,
    );
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, gal1, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN, DATA_FIELD);
  });

  it('editor should not pass', async () => {
    const result = await runQuery(query, gal1, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN, DATA_FIELD);
  });
});

describe('effects', () => {
  it('should enable', async () => {
    const result = await runQuery(query, gal1, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.toggleSource).toMatchObject({
      ...gal1,
    });
  });

  it('should disable', async () => {
    const result = await runQuery(query, nor, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.toggleSource).toMatchObject({
      ...nor,
    });
  });
});
