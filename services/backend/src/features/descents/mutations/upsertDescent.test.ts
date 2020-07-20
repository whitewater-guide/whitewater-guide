import db, { holdTransaction, rollbackTransaction } from '~/db';
import { DescentInput } from '@whitewater-guide/commons';
import { GEORGIA_BZHUZHA_QUALI } from '~/seeds/test/09_sections';
import { runQuery, fakeContext, UUID_REGEX, TIMESTAMP_REGEX } from '~/test';
import {
  DESCENT_01,
  DESCENT_02,
  DESCENT_2_SHARE_TOKEN,
  DESCENT_4_SHARE_TOKEN,
} from '~/seeds/test/18_descents';
import { TEST_USER2, TEST_USER } from '~/seeds/test/01_users';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const mutation = `
  mutation upsertDescent(
    $descent: DescentInput!
    $shareToken: String
  ) {
    upsertDescent(descent: $descent, shareToken: $shareToken) {
      id

      startedAt
      duration
      level {
        value
        unit
      }

      section {
        id
        name
      }

      comment
      public

      createdAt
      updatedAt
    }
  }
`;

const descent: DescentInput = {
  sectionId: GEORGIA_BZHUZHA_QUALI,
  startedAt: new Date(2000, 1, 1).toISOString() as any,
  duration: 3600,
  comment: 'comment',
  level: {
    value: 20,
    unit: 'cfs',
  },
  public: true,
};

it('anon should fail to insert descent', async () => {
  const result = await runQuery(mutation, { descent });
  expect(result.errors).toBeDefined();
  expect(result.data.upsertDescent).toBeNull();
});

it('non-owner should fail to update descent', async () => {
  const result = await runQuery(
    mutation,
    { descent: { ...descent, id: DESCENT_01 } },
    fakeContext(TEST_USER2),
  );
  expect(result.errors).toBeDefined();
  expect(result.data.upsertDescent).toBeNull();
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
  const result = await runQuery(
    mutation,
    { descent: badDescent },
    fakeContext(TEST_USER),
  );
  expect(result).toHaveGraphqlValidationError();
  expect(result.data.upsertDescent).toBeNull();
});

it('should insert', async () => {
  const result = await runQuery(mutation, { descent }, fakeContext(TEST_USER));
  expect(result.errors).toBeUndefined();
  expect(result.data.upsertDescent).toEqual({
    id: expect.stringMatching(UUID_REGEX),

    section: {
      id: GEORGIA_BZHUZHA_QUALI,
      name: 'Qualification',
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
  const result = await runQuery(
    mutation,
    {
      descent: {
        ...descent,
        id: DESCENT_01,
      },
    },
    fakeContext(TEST_USER),
  );
  expect(result.data.upsertDescent).toEqual({
    id: DESCENT_01,

    section: {
      id: GEORGIA_BZHUZHA_QUALI,
      name: 'Qualification',
    },

    startedAt: new Date(Date.UTC(2020, 0, 1)).toISOString(),
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
    const result = await runQuery(
      mutation,
      {
        descent,
        shareToken,
      },
      fakeContext(TEST_USER2),
    );
    expect(result.errors).toBeUndefined();
    const id = result.data.upsertDescent?.id;
    const { parent_id } = await db()
      .table('descents')
      .select(['parent_id'])
      .where({ id })
      .first();
    expect(parent_id).toBe(expectedParentDescentId);
  },
);
