import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import { act, renderHook } from '@testing-library/react-hooks';
import { REGION_DETAILS } from '@whitewater-guide/clients';
import { mockApolloProvider } from '@whitewater-guide/clients/dist/test';
import { GraphQLError } from 'graphql';
import { MockList } from 'graphql-tools';
import React from 'react';
import theme from '~/theme';
import { OfflineProgress } from '../types';
import { useDownloadRegion } from './useDownloadRegion';

jest.mock('./useDownloadMap');
jest.mock('./useDownloadPhotos');
jest.mock('./useDownloadSections');
jest.mock('./useMediaSummary');
jest.mock('@react-native-firebase/analytics', () => {
  // tslint:disable-next-line: only-arrow-functions
  return function() {
    return { logEvent: jest.fn() };
  };
});

beforeEach(() => {
  jest.resetAllMocks();
});

it.each([
  ['network error', { error: new Error('net error') }],
  [
    'graphql error',
    {
      result: {
        errors: [new GraphQLError('Error!')],
      },
    },
  ],
])('should handle downloading region data %s', async (_, err) => {
  const mocks: MockedResponse[] = [
    {
      request: {
        query: REGION_DETAILS(theme.screenWidthPx),
        variables: { regionId: 'id' },
      },
      ...err,
    },
  ];
  const wrapper: React.FC = ({ children }: any) => (
    <MockedProvider mocks={mocks}>{children}</MockedProvider>
  );
  const { result } = renderHook(() => useDownloadRegion('id'), { wrapper });
  let returned;
  await act(async () => {
    returned = await result.current.download({
      data: true,
      media: false,
      maps: false,
    });
  });
  expect(returned).toEqual(expect.any(Error));
  expect(result.current).toMatchObject({
    error: expect.any(Error),
    loading: false,
    progress: {},
  });
});

it('should provide simultaneous progress', async () => {
  const Provider = mockApolloProvider({
    mocks: {
      SectionsList: () => ({
        nodes: () => new MockList(2),
        count: () => 6,
      }),
    },
  });
  const wrapper: React.FC = ({ children }: any) => (
    <Provider>{children}</Provider>
  );
  const { result, wait } = renderHook(() => useDownloadRegion('id'), {
    wrapper,
  });
  expect(result.current).toMatchObject({
    loading: false,
  });

  act(() => {
    result.current.download({
      data: true,
      media: false,
      maps: true,
    });
  });
  expect(result.current).toMatchObject({
    loading: true,
  });
  const acc: OfflineProgress[] = [];
  await wait(() => {
    acc.push(result.current.progress);
    expect(result.current.loading).toBe(false);
    expect(
      acc.some((p) => p.data && (p.data[0] === 1 || p.data[0] === 2)),
    ).toBeTruthy();
    expect(acc[acc.length - 1]).toEqual({ data: [3, 3], maps: [100, 100] });
  });
});

it('should fail when on category fails', async () => {
  const Provider = mockApolloProvider({
    mocks: {
      SectionsList: () => ({
        nodes: () => new MockList(2),
        count: () => 6,
      }),
    },
  });
  const wrapper: React.FC = ({ children }: any) => (
    <Provider>{children}</Provider>
  );
  const { result, wait } = renderHook(() => useDownloadRegion('id'), {
    wrapper,
  });
  expect(result.current).toMatchObject({
    loading: false,
  });

  act(() => {
    result.current.download({
      data: true,
      media: true,
      maps: true,
    });
  });
  expect(result.current).toMatchObject({
    loading: true,
  });
  await wait(() => {
    expect(result.current).toMatchObject({
      error: new Error('oops'), // mocks photos fails
    });
  });
});
