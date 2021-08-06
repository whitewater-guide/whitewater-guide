import { anonContext, fakeContext } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '~/db';
import {
  ADMIN,
  ADMIN_ID,
  EDITOR_GA_EC,
  TEST_USER,
} from '~/seeds/test/01_users';
import { REGION_GEORGIA } from '~/seeds/test/04_regions';
import {
  SECTION_EDIT_LOG_ENTRY_1,
  SECTION_EDIT_LOG_ENTRY_2,
  SECTION_EDIT_LOG_ENTRY_3,
  SECTION_EDIT_LOG_ENTRY_4,
} from '~/seeds/test/15_sections_edit_log';

import { testSectionsEditLog } from './sectionsEditLog.test.generated';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _query = gql`
  query sectionsEditLog($filter: SectionsEditLogFilter, $page: Page) {
    sectionsEditLog(filter: $filter, page: $page) {
      nodes {
        __typename
        id
        section {
          __typename
          id
          name
          river {
            __typename
            id
            name
          }
          region {
            __typename
            id
            name
          }
        }
        editor {
          __typename
          id
          name
        }
        action
        diff
        createdAt
      }
      count
    }
  }
`;

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await testSectionsEditLog({}, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await testSectionsEditLog({}, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should not pass', async () => {
    const result = await testSectionsEditLog({}, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('data', () => {
  it('should return all log entries', async () => {
    const result = await testSectionsEditLog({}, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data?.sectionsEditLog).toMatchSnapshot();
  });

  it('should paginate', async () => {
    const result = await testSectionsEditLog(
      { page: { limit: 1, offset: 1 } },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.sectionsEditLog).toMatchObject({
      count: 4,
      nodes: [
        {
          id: SECTION_EDIT_LOG_ENTRY_3,
        },
      ],
    });
  });

  it('should filter by region', async () => {
    const result = await testSectionsEditLog(
      { filter: { regionId: REGION_GEORGIA } },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.sectionsEditLog).toMatchObject({
      count: 3,
      nodes: [
        { id: SECTION_EDIT_LOG_ENTRY_3 },
        { id: SECTION_EDIT_LOG_ENTRY_2 },
        { id: SECTION_EDIT_LOG_ENTRY_1 },
      ],
    });
  });

  it('should filter by editor', async () => {
    const result = await testSectionsEditLog(
      { filter: { editorId: ADMIN_ID } },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.sectionsEditLog).toMatchObject({
      count: 2,
      nodes: [
        { id: SECTION_EDIT_LOG_ENTRY_4 },
        { id: SECTION_EDIT_LOG_ENTRY_3 },
      ],
    });
  });

  it('should filter by region AND editor', async () => {
    const result = await testSectionsEditLog(
      { filter: { regionId: REGION_GEORGIA, editorId: ADMIN_ID } },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.sectionsEditLog).toMatchObject({
      count: 1,
      nodes: [{ id: SECTION_EDIT_LOG_ENTRY_3 }],
    });
  });
});
