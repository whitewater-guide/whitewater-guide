import { MockList } from '@graphql-tools/mock';
import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react-native';
import { mockApolloProvider } from '@whitewater-guide/clients/dist/test';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';

import { RegionsListDocument } from '~/screens/regions-list/regionsList.generated';

import useSkus from './useSkus';

const prepare = async () => {
  const Provider = mockApolloProvider({
    mocks: {
      RegionsList: () => ({
        nodes: () => new MockList(2),
        count: () => 3,
      }),
      Region: () => ({
        sku: (_: any, __: any, { counters }: any, info: any) => {
          const { key, seq } = counters.resolveNext(info);
          return `${key}.${(seq - 1) % 2}`;
        },
      }),
    },
  });
  const query = Provider.client.watchQuery({
    query: RegionsListDocument,
    fetchPolicy: 'cache-and-network',
  });
  await query.result();
  return { Provider, query };
};

it('should read skus from regions list query', async () => {
  const { Provider } = await prepare();
  const wrapper: FC<PropsWithChildren> = ({ children }) => (
    <Provider>{children}</Provider>
  );
  const { result, waitForNextUpdate, unmount } = renderHook(() => useSkus(), {
    wrapper,
  });
  await waitForNextUpdate();
  expect(result.current).toEqual(
    new Map([
      ['Region.sku.0', false],
      ['Region.sku.1', true],
    ]),
  );
  unmount();
});

it('should not change when query is refreshed', async () => {
  const { Provider, query } = await prepare();
  const wrapper: FC<PropsWithChildren> = ({ children }) => (
    <Provider>{children}</Provider>
  );
  const { result, waitForNextUpdate, unmount } = renderHook(() => useSkus(), {
    wrapper,
  });
  await waitForNextUpdate();
  const firstResult = result.current;
  await act(() => {
    query.refetch();
  });
  expect(result.current).toBe(firstResult);
  unmount();
});
