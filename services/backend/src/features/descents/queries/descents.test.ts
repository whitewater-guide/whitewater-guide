import { DescentsFilter } from '@whitewater-guide/commons';
import { holdTransaction, rollbackTransaction } from '~/db';
import { TEST_USER, TEST_USER2, TEST_USER_ID } from '~/seeds/test/01_users';
import {
  DESCENT_01,
  DESCENT_02,
  DESCENT_03,
  DESCENT_04,
  DESCENT_05,
  DESCENT_07,
  DESCENT_10,
  SECTION_1,
} from '~/seeds/test/18_descents';
import { fakeContext, runQuery } from '~/test';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query listDescents($filter: DescentsFilter, $page: Page) {
    descents(filter: $filter, page: $page) {
      edges {
        node {
          id

          startedAt
          duration
          level {
            value
            unit
          }
          comment
          public

          createdAt
          updatedAt

          section {
            id
            difficulty

            region {
              id
              name
            }
            river {
              id
              name
            }
            name
          }
        }
        cursor
      }
      pageInfo {
        endCursor
        hasMore
      }
    }
  }
`;

const getIds = (result: any): string[] =>
  result.descents?.edges.map(({ node }: any) => node.id) || [];

it('should match snapshot', async () => {
  const result: any = await runQuery(query, {}, fakeContext(TEST_USER));
  expect(result).toMatchSnapshot();
});

it.each([
  ['anon should not see private descents', undefined, false],
  ['non-owner should not see private descents', TEST_USER2, false],
  ['owner should see private descents', TEST_USER, true],
])('%s', async (_, user, visible) => {
  const result = await runQuery(query, {}, fakeContext(user));
  const actual = getIds(result.data).includes(DESCENT_02);
  expect(actual).toBe(visible);
});

type FilterTestCase = [string, DescentsFilter, string[]];
// use snapshot as a baseline
it.each<FilterTestCase>([
  [
    'difficulty',
    { difficulty: [3.5, 4] },
    [DESCENT_05, DESCENT_03, DESCENT_10, DESCENT_04, DESCENT_01],
  ],
  [
    'open date range',
    { startDate: new Date('2020-01-03T00:00:00.000Z').toISOString() as any },
    [DESCENT_07, DESCENT_05, DESCENT_03],
  ],
  [
    'closed date range',
    {
      startDate: new Date('2020-01-02T00:00:00.000Z').toISOString() as any,
      endDate: new Date('2020-01-05T00:00:00.000Z').toISOString() as any,
    },
    [DESCENT_05, DESCENT_03, DESCENT_02],
  ],
  [
    'user',
    {
      userId: TEST_USER_ID,
    },
    [DESCENT_03, DESCENT_02, DESCENT_01],
  ],
  [
    'section id', // including derived sections
    {
      sectionId: SECTION_1,
    },
    [DESCENT_10, DESCENT_04, DESCENT_01],
  ],
  [
    'section name',
    {
      sectionName: 'eCa',
    },
    [DESCENT_02, DESCENT_10, DESCENT_04, DESCENT_01],
  ],
])(
  `should filter and paginate by %s`,
  async (_, filter, [id1, id2, ...restIds]) => {
    let result = await runQuery(
      query,
      { filter, page: { limit: 1 } },
      fakeContext(TEST_USER),
    );
    expect(result.errors).toBeUndefined();
    expect(getIds(result.data)).toEqual([id1]);
    expect(result.data.descents?.pageInfo.hasMore).toBe(true);
    result = await runQuery(
      query,
      {
        filter,
        page: {
          limit: 1,
          after: result.data.descents?.pageInfo.endCursor,
        },
      },
      fakeContext(TEST_USER),
    );
    expect(result.errors).toBeUndefined();
    expect(getIds(result.data)).toEqual([id2]);
    expect(result.data.descents?.pageInfo.hasMore).toBe(true);
    result = await runQuery(
      query,
      {
        filter,
        page: {
          limit: 99,
          after: result.data.descents?.pageInfo.endCursor,
        },
      },
      fakeContext(TEST_USER),
    );
    expect(result.errors).toBeUndefined();
    expect(getIds(result.data)).toEqual(restIds);
    expect(result.data.descents?.pageInfo.hasMore).toBe(false);
  },
);
