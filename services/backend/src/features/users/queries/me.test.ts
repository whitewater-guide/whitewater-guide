import { holdTransaction, rollbackTransaction } from '@db';
import { redis } from '@redis';
import {
  ADMIN,
  BOOM_USER_3500,
  BOOM_USER_3500_ID,
  EDITOR_GA_EC,
  TEST_USER,
  TEST_USER_ID,
} from '@seeds/01_users';
import { GROUP_ALL } from '@seeds/03_groups';
import { REGION_ECUADOR, REGION_GEORGIA } from '@seeds/04_regions';
import { anonContext, fakeContext, runQuery } from '@test';
import axios from 'axios';

jest.mock('axios');

beforeEach(async () => {
  await holdTransaction();
  jest.resetAllMocks();
  await redis.flushall();
  (axios.get as any).mockResolvedValue({
    data: { data: { url: 'https://ww.guide/pic.jpg' } },
  });
});
afterEach(async () => {
  await rollbackTransaction();
  redis.removeAllListeners();
});

const query = `
{
  me {
    id
    name
    avatar
    admin
    email
    createdAt
    updatedAt
    language
    imperial
    editorSettings {
      language
    }
    accounts {
      id
      provider
    }
  }
}
`;

it('should return null for anon', async () => {
  const result = await runQuery(query, undefined, anonContext());
  expect(result.errors).toBeUndefined();
  expect(result.data!.me).toBeNull();
});

it('should return local user', async () => {
  const result = await runQuery(query, undefined, fakeContext(EDITOR_GA_EC));
  expect(result.errors).toBeUndefined();
  expect(result.data!.me).toMatchSnapshot();
});

it('should return facebook user', async () => {
  const result = await runQuery(query, undefined, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data!.me).toMatchSnapshot();
});

it('should cache fb avatar', async () => {
  await runQuery(query, undefined, fakeContext(ADMIN));
  const result = await runQuery(query, undefined, fakeContext(ADMIN));
  expect(axios.get).toHaveBeenCalledTimes(1);
  expect(result.data!.me).toMatchObject({ avatar: 'https://ww.guide/pic.jpg' });
});

it('should return purchased regions', async () => {
  const queryWithRegions = `
  {
    me {
      id
      purchasedRegions {
        id
        name
      }
    }
  }
  `;
  const result = await runQuery(
    queryWithRegions,
    undefined,
    fakeContext(TEST_USER),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data!.me).toMatchObject({
    id: TEST_USER_ID,
    purchasedRegions: [
      {
        id: REGION_GEORGIA,
        name: 'Georgia',
      },
    ],
  });
});

it('should return purchased groups', async () => {
  const queryWithRegions = `
  {
    me {
      id
      purchasedGroups {
        id
        name
      }
    }
  }
  `;
  const result = await runQuery(
    queryWithRegions,
    undefined,
    fakeContext(BOOM_USER_3500),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data!.me).toMatchObject({
    id: BOOM_USER_3500_ID,
    purchasedGroups: [
      {
        id: GROUP_ALL,
        name: 'All regions',
      },
    ],
  });
});

it('should not return purchased regions with invalid transactions', async () => {
  const queryWithRegions = `
  {
    me {
      id
      purchasedRegions {
        id
        name
      }
    }
  }
  `;
  const result = await runQuery(
    queryWithRegions,
    undefined,
    fakeContext(TEST_USER),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data!.me.purchasedRegions).not.toContainEqual(
    expect.objectContaining({ id: REGION_ECUADOR }),
  );
});
