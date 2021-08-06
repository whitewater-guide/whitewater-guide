import { anonContext, fakeContext } from '@test';
import axios from 'axios';
import gql from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '~/db';
import {
  ADMIN,
  BOOM_USER_3500,
  BOOM_USER_3500_ID,
  EDITOR_GA_EC,
  TEST_USER,
  TEST_USER_ID,
} from '~/seeds/test/01_users';
import { GROUP_ALL } from '~/seeds/test/03_groups';
import { REGION_ECUADOR, REGION_GEORGIA } from '~/seeds/test/04_regions';

import {
  testMyProfile,
  testMyPurchasedGroups,
  testMyPurchasedRegions,
} from './me.test.generated';

jest.mock('axios');

beforeEach(async () => {
  await holdTransaction();
  jest.resetAllMocks();
  (axios.get as any).mockResolvedValue({
    data: { data: { url: 'https://ww.guide/pic.jpg' } },
  });
});
afterEach(async () => {
  await rollbackTransaction();
});

const _query = gql`
  query myProfile {
    me {
      ...MyProfile
      createdAt
      updatedAt
    }
  }
`;

it('should return null for anon', async () => {
  const result = await testMyProfile(undefined, anonContext());
  expect(result.errors).toBeUndefined();
  expect(result.data?.me).toBeNull();
});

it('should return local user', async () => {
  const result = await testMyProfile(undefined, fakeContext(TEST_USER));
  expect(result.errors).toBeUndefined();
  expect(result.data?.me).toMatchSnapshot();
});

it('should return facebook user', async () => {
  const result = await testMyProfile(undefined, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data?.me).toMatchSnapshot();
});

it('should return editor', async () => {
  const result = await testMyProfile(undefined, fakeContext(EDITOR_GA_EC));
  expect(result.errors).toBeUndefined();
  expect(result.data?.me?.editor).toBe(true);
});

describe('purchased regions', () => {
  const _q = gql`
    query myPurchasedRegions {
      me {
        id
        purchasedRegions {
          id
          name
        }
      }
    }
  `;

  it('should return purchased regions', async () => {
    const result = await testMyPurchasedRegions(
      undefined,
      fakeContext(TEST_USER),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.me).toMatchObject({
      id: TEST_USER_ID,
      purchasedRegions: [
        {
          id: REGION_GEORGIA,
          name: 'Georgia',
        },
      ],
    });
  });

  it('should not return purchased regions with invalid transactions', async () => {
    const result = await testMyPurchasedRegions(
      undefined,
      fakeContext(TEST_USER),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.me?.purchasedRegions).not.toContainEqual(
      expect.objectContaining({ id: REGION_ECUADOR }),
    );
  });
});

describe('purchased groups', () => {
  it('should return purchased groups', async () => {
    const _q = gql`
      query myPurchasedGroups {
        me {
          id
          purchasedGroups {
            id
            name
          }
        }
      }
    `;
    const result = await testMyPurchasedGroups(
      undefined,
      fakeContext(BOOM_USER_3500),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.me).toMatchObject({
      id: BOOM_USER_3500_ID,
      purchasedGroups: [
        {
          id: GROUP_ALL,
          name: 'All regions',
        },
      ],
    });
  });
});
