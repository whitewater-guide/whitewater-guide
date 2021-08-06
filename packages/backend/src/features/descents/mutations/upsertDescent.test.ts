import { fakeContext, TIMESTAMP_REGEX, UUID_REGEX } from '@test';
import { DescentInput } from '@whitewater-guide/schema';
import gql from 'graphql-tag';

import { db, holdTransaction, rollbackTransaction } from '~/db';
import { TEST_USER, TEST_USER2 } from '~/seeds/test/01_users';
import { REGION_GEORGIA } from '~/seeds/test/04_regions';
import { RIVER_BZHUZHA } from '~/seeds/test/07_rivers';
import { GEORGIA_BZHUZHA_QUALI } from '~/seeds/test/09_sections';
import {
  DESCENT_01,
  DESCENT_02,
  DESCENT_2_SHARE_TOKEN,
  DESCENT_4_SHARE_TOKEN,
} from '~/seeds/test/18_descents';

import { testUpsertDescent } from './upsertDescent.test.generated';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _mutation = gql`
  mutation upsertDescent($descent: DescentInput!, $shareToken: String) {
    upsertDescent(descent: $descent, shareToken: $shareToken) {
      ...DescentCore
      ...TimestampedMeta

      section {
        ...SectionNameShort
        region {
          id
          name
        }
      }
    }
  }
`;

const descent: DescentInput = {
  sectionId: GEORGIA_BZHUZHA_QUALI,
  startedAt: new Date(Date.UTC(2000, 1, 1)).toISOString() as any,
  duration: 3600,
  comment: 'comment',
  level: {
    value: 20,
    unit: 'cfs',
  },
  public: true,
};

it('anon should fail to insert descent', async () => {
  const result = await testUpsertDescent({ descent });
  expect(result.errors).toBeDefined();
  expect(result.data?.upsertDescent).toBeNull();
});

it('non-owner should fail to update descent', async () => {
  const result = await testUpsertDescent(
    { descent: { ...descent, id: DESCENT_01 } },
    fakeContext(TEST_USER2),
  );
  expect(result.errors).toBeDefined();
  expect(result.data?.upsertDescent).toBeNull();
});

it('should fail on validation check', async () => {
  const badDescent: DescentInput = {
    sectionId: 'foo',
    startedAt: new Date(2000, 1, 1).toISOString() as any,
    duration: -100,
    comment: 'comment',
    level: null,
    public: true,
  };
  const result = await testUpsertDescent(
    { descent: badDescent },
    fakeContext(TEST_USER),
  );
  expect(result).toHaveGraphqlValidationError();
  expect(result.data?.upsertDescent).toBeNull();
});

it('should insert', async () => {
  const result = await testUpsertDescent({ descent }, fakeContext(TEST_USER));
  expect(result.errors).toBeUndefined();
  expect(result.data?.upsertDescent).toEqual({
    id: expect.stringMatching(UUID_REGEX),

    section: {
      id: GEORGIA_BZHUZHA_QUALI,
      name: 'Qualification',
      region: {
        id: REGION_GEORGIA,
        name: 'Georgia',
      },
      river: {
        id: RIVER_BZHUZHA,
        name: 'Bzhuzha',
      },
    },

    startedAt: expect.stringMatching(TIMESTAMP_REGEX),
    duration: 3600,
    comment: 'comment',
    level: {
      value: 20,
      unit: 'cfs',
    },
    public: true,

    createdAt: expect.stringMatching(TIMESTAMP_REGEX),
    updatedAt: expect.stringMatching(TIMESTAMP_REGEX),
  });
});

it('should update', async () => {
  const result = await testUpsertDescent(
    {
      descent: {
        ...descent,
        id: DESCENT_01,
      },
    },
    fakeContext(TEST_USER),
  );
  expect(result.data?.upsertDescent).toEqual({
    id: DESCENT_01,

    section: {
      id: GEORGIA_BZHUZHA_QUALI,
      name: 'Qualification',
      region: {
        id: REGION_GEORGIA,
        name: 'Georgia',
      },
      river: {
        id: RIVER_BZHUZHA,
        name: 'Bzhuzha',
      },
    },

    startedAt: new Date(Date.UTC(2000, 1, 1)).toISOString(),
    duration: 3600,
    comment: 'comment',
    level: {
      value: 20,
      unit: 'cfs',
    },
    public: true,
    createdAt: new Date(Date.UTC(2020, 0, 1)).toISOString(),
    updatedAt: expect.stringMatching(TIMESTAMP_REGEX),
  });
});

type ParentTestCase = [string, string, string];

it.each<ParentTestCase>([
  ['private ', DESCENT_2_SHARE_TOKEN, DESCENT_02],
  ['recursive ', DESCENT_4_SHARE_TOKEN, DESCENT_01],
])(
  'should set %sparent references when token is provided',
  async (_, shareToken, expectedParentDescentId) => {
    const result = await testUpsertDescent(
      {
        descent,
        shareToken,
      },
      fakeContext(TEST_USER2),
    );
    expect(result.errors).toBeUndefined();
    const id = result.data?.upsertDescent?.id;
    const { parent_id } = await db()
      .table('descents')
      .select(['parent_id'])
      .where({ id })
      .first();
    expect(parent_id).toBe(expectedParentDescentId);
  },
);
