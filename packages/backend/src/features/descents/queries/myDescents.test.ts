import { gql } from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '../../../db/index';
import { TEST_USER } from '../../../seeds/test/01_users';
import { fakeContext } from '../../../test/index';
import { testListMyDescents } from './myDescents.test.generated';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _query = gql`
  query listMyDescents($filter: DescentsFilter, $page: Page) {
    myDescents(filter: $filter, page: $page) {
      edges {
        node {
          ...DescentCore
          ...TimestampedMeta
          section {
            ...SectionNameShort
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
  const result = await testListMyDescents({}, fakeContext(TEST_USER));
  expect(result.data).toMatchSnapshot();
});

it('anon should fail', async () => {
  const result = await testListMyDescents();
  expect(result.errors).toBeTruthy();
  expect(result.data?.myDescents).toBeNull();
});
