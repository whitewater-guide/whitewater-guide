import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import { renderHook } from '@testing-library/react-hooks';
import type { NamedNode, Page } from '@whitewater-guide/schema';
import gql from 'graphql-tag';
import React from 'react';

import { configureApolloCache } from './configureApolloCache';
import { useChunkedQuery } from './useChunkedQuery';

const QUERY = gql`
  query listRegions($page: Page, $foo: String) {
    regions(page: $page, filter: { searchString: $foo }) {
      nodes {
        id
      }
      count
    }
  }
`;

const mocks: MockedResponse[] = [
  {
    request: {
      query: QUERY,
      variables: { foo: 'foo', page: { limit: 1 } },
    },
    result: {
      data: {
        regions: {
          __typename: 'RegionsList',
          nodes: [
            {
              __typename: 'Region',
              id: '1',
            },
          ],
          count: 3,
        },
      },
    },
  },
  {
    request: {
      query: QUERY,
      variables: { page: { limit: 1, offset: 1 }, foo: 'foo' },
    },
    result: {
      data: {
        regions: {
          __typename: 'RegionsList',
          nodes: [
            {
              __typename: 'Region',
              id: '2',
            },
          ],
          count: 3,
        },
      },
    },
  },
  {
    request: {
      query: QUERY,
      variables: { page: { limit: 1, offset: 2 }, foo: 'foo' },
    },
    result: {
      data: {
        regions: {
          __typename: 'RegionsList',
          nodes: [
            {
              __typename: 'Region',
              id: '3',
            },
          ],
          count: 3,
        },
      },
    },
  },
];

interface Connection<T> {
  __typename?: string;
  count?: number;
  nodes?: T[];
}

interface QVars {
  page?: Page;
  foo?: string;
}

interface QResult {
  regions: Connection<NamedNode>;
}

beforeEach(() => {
  jest.resetAllMocks();
});

it('should provide 3 sections', async () => {
  const cache = configureApolloCache();
  const wrapper: React.FC = ({ children }: any) => (
    <MockedProvider mocks={mocks} cache={cache}>
      {children}
    </MockedProvider>
  );
  const { result, waitFor } = renderHook(
    (variables: any) =>
      useChunkedQuery<QResult, QVars>(QUERY, { variables }, 1),
    { wrapper, initialProps: { foo: 'foo' } },
  );
  await waitFor(() => {
    expect(result.current.data?.regions.nodes).toMatchObject([{ id: '1' }]);
  });
  await waitFor(() => {
    expect(result.current.data?.regions.nodes).toMatchObject([
      { id: '1' },
      { id: '2' },
    ]);
  });
  await waitFor(() => {
    expect(result.current.data?.regions.nodes).toMatchObject([
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ]);
  });
});
