import { holdTransaction, rollbackTransaction } from '~/db';
import { runQuery, fakeContext } from '~/test';
import { TEST_USER } from '~/seeds/test/01_users';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query listMyDescents($filter: DescentsFilter, $page: Page) {
    myDescents(filter: $filter, page: $page) {
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

it('should match snapshot', async () => {
  const result = await runQuery(query, {}, fakeContext(TEST_USER));
  expect(result).toMatchSnapshot();
});

it('anon should fail', async () => {
  const result = await runQuery(query);
  expect(result.errors).toBeTruthy();
  expect(result.data.myDescents).toBeNull();
});
