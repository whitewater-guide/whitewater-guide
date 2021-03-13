import { act, renderHook } from '@testing-library/react-hooks';
import { mockApolloProvider } from '@whitewater-guide/clients/dist/test';
import { MockList } from 'graphql-tools';
import React from 'react';

import { useDownloadRegion } from './hooks';
import {
  OfflineContentProvider,
  useOfflineContent,
} from './OfflineContentProvider';

const TEST_REGION = { id: 'id', name: 'Name' };
const ID = TEST_REGION.id;
const mockUseDownloadRegion = useDownloadRegion as jest.Mock;

jest.mock('./hooks/useDownloadRegion', () => {
  return {
    useDownloadRegion: jest.fn(),
  };
});

beforeEach(() => {
  jest.resetAllMocks();
  // override as needed in concrete test
  mockUseDownloadRegion.mockReturnValue({
    download: jest.fn().mockResolvedValue(null),
    progress: {},
  });
});

const render = () => {
  const Provider = mockApolloProvider({
    mocks: {
      SectionsList: () => ({
        nodes: () => new MockList(2),
        count: () => 6,
      }),
    },
  });
  const wrapper: React.FC = ({ children }: any) => (
    <Provider>
      <OfflineContentProvider>{children}</OfflineContentProvider>
    </Provider>
  );
  return renderHook(() => useOfflineContent(), { wrapper });
};

it('should start in idle state', () => {
  const { result } = render();
  expect(result.current).toEqual({
    dialogRegion: null,
    download: expect.any(Function),
    error: undefined,
    progress: {},
    regionInProgress: null,
    setDialogRegion: expect.any(Function),
  });
});

it('should open and close dialog', () => {
  const { result } = render();
  act(() => {
    result.current.setDialogRegion(TEST_REGION);
  });
  expect(result.current.dialogRegion).toEqual(TEST_REGION);
  act(() => {
    result.current.setDialogRegion(null);
  });
  expect(result.current.dialogRegion).toBeNull();
});

it('should set region in progress when download begins', () => {
  const { result } = render();
  act(() => {
    result.current.download(ID, { data: true });
  });
  expect(result.current.regionInProgress).toBe(ID);
});

it('should close dialog automatically on success', async () => {
  const { result, waitFor } = render();
  act(() => {
    result.current.setDialogRegion(TEST_REGION);
  });
  act(() => {
    result.current.download(ID, { data: true });
  });
  expect(result.current).toMatchObject({
    regionInProgress: ID,
    dialogRegion: TEST_REGION,
  });
  await waitFor(() => {
    expect(result.current).toMatchObject({
      regionInProgress: null,
      dialogRegion: null,
    });
  });
});

it('should reset to idle state after error', async () => {
  const { result, waitFor } = render();
  mockUseDownloadRegion
    .mockReturnValueOnce({
      download: jest.fn().mockResolvedValue(null),
      progress: {},
      error: undefined,
    })
    .mockReturnValueOnce({
      download: jest.fn().mockResolvedValue(new Error('download error')),
      progress: {},
      error: new Error('download error'),
    })
    .mockReturnValue({
      download: jest.fn().mockResolvedValue(null),
      progress: {},
      error: undefined,
    });
  act(() => {
    result.current.setDialogRegion(TEST_REGION);
  });
  act(() => {
    result.current.download(ID, { data: true });
  });
  await waitFor(() => {
    expect(result.current).toMatchObject({
      regionInProgress: ID,
      dialogRegion: TEST_REGION,
      error: new Error('download error'),
    });
  });
  act(() => {
    result.current.setDialogRegion(null);
  });
  expect(result.current).toMatchObject({
    regionInProgress: null,
    dialogRegion: null,
    error: undefined,
  });
});
