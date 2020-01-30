import { ADMIN, EDITOR_GA_EC, TEST_USER } from '@seeds/01_users';
import { ApolloErrorCodes, HarvestMode } from '@whitewater-guide/commons';
import { anonContext, fakeContext, runQuery } from '@test';

jest.mock('../../gorge/connector');

beforeEach(() => {
  jest.resetAllMocks();
});

const query = `
  query listScripts {
    scripts {
      id
      name
      harvestMode
    }
  }
`;

describe('resolvers chain', () => {
  it('anon shall not pass', async () => {
    const result = await runQuery(query, undefined, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user shall not pass', async () => {
    const result = await runQuery(query, undefined, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor shall not pass', async () => {
    const result = await runQuery(query, undefined, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

it('should return some scripts', async () => {
  const result = await runQuery(query, undefined, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data!.scripts).toEqual([
    {
      id: 'all_at_once',
      name: 'all_at_once',
      harvestMode: HarvestMode.ALL_AT_ONCE,
    },
    {
      id: 'one_by_one',
      name: 'one_by_one',
      harvestMode: HarvestMode.ONE_BY_ONE,
    },
  ]);
});
