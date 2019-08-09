import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import { renderHook } from '@testing-library/react-hooks';
import { Connection, NamedNode, Page } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import React from 'react';
import { useStreamingQuery } from './useStreamingQuery';

const QUERY = gql`
  query listRegions($page: Page, $foo: String) {
    regions(page: $page, foo: $foo) {
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
  {
    request: {
      query: QUERY,
      variables: { foo: 'bar', page: { limit: 1 } },
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
  const { result, waitForNextUpdate, unmount } = renderHook(
    (variables: any) =>
      useStreamingQuery<QResult, QVars>(QUERY, { variables }, 1),
    { wrapper, initialProps: { foo: 'foo' } },
  );
  await waitForNextUpdate();
  expect(result.current.data!.regions.nodes).toMatchObject([{ id: '1' }]);
  await waitForNextUpdate();
  expect(result.current.data!.regions.nodes).toMatchObject([
    { id: '1' },
    { id: '2' },
  ]);
  await waitForNextUpdate();
  expect(result.current.data!.regions.nodes).toMatchObject([
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]);
  unmount();
});

it('should provide 3 more sections when vars change', async () => {
  const wrapper: React.FC = ({ children }: any) => (
    <MockedProvider mocks={mocks}>{children}</MockedProvider>
  );
  const { result, waitForNextUpdate, rerender, unmount } = renderHook(
    (variables: any) =>
      useStreamingQuery<QResult, QVars>(QUERY, { variables }, 1),
    { wrapper, initialProps: { foo: 'foo' } },
  );
  await waitForNextUpdate();
  expect(result.current.data!.regions.nodes).toMatchObject([{ id: '1' }]);
  await waitForNextUpdate();
  expect(result.current.data!.regions.nodes).toMatchObject([
    { id: '1' },
    { id: '2' },
  ]);
  await waitForNextUpdate();
  expect(result.current.data!.regions.nodes).toMatchObject([
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]);
  rerender({ foo: 'bar' });
  await waitForNextUpdate();
  expect(result.current.data!.regions.nodes).toMatchObject([{ id: '4' }]);
  await waitForNextUpdate();
  expect(result.current.data!.regions.nodes).toMatchObject([
    { id: '4' },
    { id: '5' },
  ]);
  await waitForNextUpdate();
  expect(result.current.data!.regions.nodes).toMatchObject([
    { id: '4' },
    { id: '5' },
    { id: '6' },
  ]);
  unmount();
});
