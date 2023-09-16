import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import { act, renderHook } from '@testing-library/react-hooks';
import React from 'react';

import {
  graphqlErrorPath1,
  graphqlErrorPath2,
  happyPath,
  netErrorPath1,
  netErrorPath2,
  TEST_OFFLINE_SECTIONS,
} from '../test-utils/mockOfflineSections';
import type { OfflineProgress } from '../types';
import { PhotoChannel } from '../utils';
import useDownloadSections from './useDownloadSections';

beforeEach(() => {
  jest.resetAllMocks();
});

interface RenderProps {
  onProgress: (p: Partial<OfflineProgress>) => void;
}

const render = (mocks: MockedResponse[], initialProps: RenderProps) => {
  const wrapper: React.FC = ({ children }: any) => (
    <MockedProvider mocks={mocks}>{children}</MockedProvider>
  );
  return renderHook(
    (props: RenderProps) =>
      useDownloadSections(props.onProgress, {
        query: TEST_OFFLINE_SECTIONS,
        limit: 1,
      }),
    {
      wrapper,
      initialProps,
    },
  );
};

it('should begin in idle state', () => {
  const { result } = render(happyPath, {
    onProgress: jest.fn(),
  });
  expect(result.current).toEqual({
    download: expect.any(Function),
    error: undefined,
    loading: false,
  });
});

it('should report progress', async () => {
  const onProgress = jest.fn();
  const photoChannel = new PhotoChannel();
  const { result } = render(happyPath, {
    onProgress,
  });
  await act(async () => {
    await result.current.download('__region_id__', 999, photoChannel);
  });
  expect(result.current).toEqual({
    download: expect.any(Function),
    error: undefined,
    loading: false,
  });
  expect(onProgress.mock.calls).toEqual([
    [{ data: [0, 999] }],
    [{ data: [1, 3] }],
    [{ data: [2, 3] }],
    [{ data: [3, 3] }],
  ]);
});

it('should enqueue photos', async () => {
  const onProgress = jest.fn();
  const photoChannel = new PhotoChannel();
  const spy = jest.spyOn(photoChannel, 'put');
  const { result } = render(happyPath, {
    onProgress,
  });
  await act(async () => {
    await result.current.download('__region_id__', 999, photoChannel);
  });
  expect(spy.mock.calls).toEqual([
    [['photo1.jpg', 'thumb1.jpg']],
    [['photo2.jpg', 'thumb2.jpg']],
    [['photo3.jpg', 'thumb3.jpg']],
  ]);
  expect(photoChannel.closed).toBe(true);
});

it.each([
  ['initial request net error', netErrorPath1],
  ['fetch more net error', netErrorPath2],
  ['initial request graphql error', graphqlErrorPath1],
  ['fetch more graphql error', graphqlErrorPath2],
])('should be resumed after %s', async (_, mocks) => {
  const onProgress = jest.fn();
  const photoChannel = new PhotoChannel();
  const { result } = render(mocks, {
    onProgress,
  });
  let returned;
  await act(async () => {
    returned = await result.current.download(
      '__region_id__',
      999,
      photoChannel,
    );
  });
  expect(returned).toEqual(expect.any(Error));
  expect(result.current).toMatchObject({
    error: expect.any(Error),
    loading: false,
  });
});
