import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import { renderHook } from '@testing-library/react-hooks';
import { Connection, NamedNode, Page } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import React from 'react';
import { useStreamingQuery } from './useStreamingQuery';

const QUERY = gql`
  query listRegions($page: Page, $foo: String) {
    regions(page: $page) {
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
      variables: { foo: 'foo' },
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
              id: '1',
            },
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
              id: '1',
            },
            {
              __typename: 'Region',
              id: '2',
            },
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
  {
    request: {
      query: QUERY,
      variables: { foo: 'bar' },
    },
    result: {
      data: {
        regions: {
          __typename: 'RegionsList',
          nodes: [
            {
              __typename: 'Region',
              id: '4',
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
      variables: { page: { limit: 1, offset: 1 }, foo: 'bar' },
    },
    result: {
      data: {
        regions: {
          __typename: 'RegionsList',
          nodes: [
            {
              __typename: 'Region',
              id: '4',
            },
            {
              __typename: 'Region',
              id: '5',
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
      variables: { page: { limit: 1, offset: 2 }, foo: 'bar' },
    },
    result: {
      data: {
        regions: {
          __typename: 'RegionsList',
          nodes: [
            {
              __typename: 'Region',
              id: '4',
            },
            {
              __typename: 'Region',
              id: '5',
            },
            {
              __typename: 'Region',
              id: '6',
            },
          ],
          count: 3,
        },
      },
    },
  },
];

interface QVars {
  page?: Page;
  foo?: string;
}

interface QResult {
  regions: Connection<NamedNode>;
}

beforeEach(() => {
  jest.clearAllMocks();
});

it('should provide 3 sections', async () => {
  const wrapper: React.FC = ({ children }: any) => (
    <MockedProvider mocks={mocks}>{children}</MockedProvider>
  );
  const { result, waitForNextUpdate } = renderHook(
    (variables: any) =>
      useStreamingQuery<QResult, QVars>(QUERY, { variables }, 1),
    { wrapper, initialProps: { foo: 'foo' } },
  );
  await waitForNextUpdate();
  expect(result.current.data!.regions.nodes).toHaveLength(1);
  await waitForNextUpdate();
  expect(result.current.data!.regions.nodes).toHaveLength(2);
  await waitForNextUpdate();
  expect(result.current.data!.regions.nodes).toHaveLength(3);
});

it('should provide 3 more sections when vars change', async () => {
  const wrapper: React.FC = ({ children }: any) => (
    <MockedProvider mocks={mocks}>{children}</MockedProvider>
  );
  const { result, waitForNextUpdate, rerender } = renderHook(
    (variables: any) =>
      useStreamingQuery<QResult, QVars>(QUERY, { variables }, 1),
    { wrapper, initialProps: { foo: 'foo' } },
  );
  await waitForNextUpdate();
  expect(result.current.data!.regions.nodes).toHaveLength(1);
  await waitForNextUpdate();
  expect(result.current.data!.regions.nodes).toHaveLength(2);
  await waitForNextUpdate();
  expect(result.current.data!.regions.nodes).toHaveLength(3);
  rerender({ foo: 'bar' });
  await waitForNextUpdate();
  expect(result.current.data!.regions.nodes).toHaveLength(1);
  await waitForNextUpdate();
  expect(result.current.data!.regions.nodes).toHaveLength(2);
  await waitForNextUpdate();
  expect(result.current.data!.regions.nodes).toHaveLength(3);
});
