import { MockedProvider } from '@apollo/client/testing';
import { act, renderHook } from '@testing-library/react-hooks';
import { GraphQLError } from 'graphql';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';

import { GetUploadLinkDocument } from './getUploadLink.generated';
import { uploadFile } from './uploadFile';
import { useUploadLink } from './useUploadLink';

const querySuccess = [
  {
    request: {
      query: GetUploadLinkDocument,
      variables: { version: 'V3' },
    },
    result: {
      data: {
        uploadLink: {
          __typename: 'UploadLink',
          postURL: 'https://post.here',
          formData: { foo: 'bar' },
          key: '12-xy',
        },
      },
    },
  },
];

const networkError = [
  {
    request: {
      query: GetUploadLinkDocument,
    },
    error: new Error('network error'),
  },
];

const graphqlError = [
  {
    request: {
      query: GetUploadLinkDocument,
    },
    result: {
      errors: [new GraphQLError('Error!')],
    },
  },
];

jest.mock('./uploadFile', () => ({
  __esModule: true,
  uploadFile: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
});

it('should update uploading state', async () => {
  const wrapper: FC<PropsWithChildren> = ({ children }) => (
    <MockedProvider mocks={querySuccess}>{children as any}</MockedProvider>
  );
  (uploadFile as jest.Mock).mockResolvedValue('file-url.jpg');
  const { result, waitForNextUpdate } = renderHook(() => useUploadLink(), {
    wrapper,
  });
  let uploadResult = '';
  const fileLike = {
    name: 'foo.jpg',
    type: 'image/jpeg',
    uri: 'file://foo.jpg',
  };
  act(() => {
    result.current.upload(fileLike).then((res) => {
      uploadResult = res;
    });
  });
  expect(result.current.uploading).toBe(true);
  await waitForNextUpdate();
  expect(result.current.uploading).toBe(false);
  expect(uploadFile).toHaveBeenCalledWith(
    fileLike,
    expect.objectContaining({ __typename: 'UploadLink' }),
    expect.any(AbortController),
  );
  expect(uploadResult).toBe('file-url.jpg');
});

it.each([
  ['minio error', querySuccess],
  ['apollo network error', networkError],
  ['apollo graphql error', graphqlError],
])('should work correctly if upload fails due to %s', async (_, mocks: any) => {
  const wrapper: FC<PropsWithChildren> = ({ children }) => (
    <MockedProvider mocks={mocks}>{children as any}</MockedProvider>
  );
  if (mocks === querySuccess) {
    (uploadFile as jest.Mock).mockRejectedValue(new Error('boom!'));
  } else {
    (uploadFile as jest.Mock).mockResolvedValue('file-url.jpg');
  }
  const { result, waitForNextUpdate } = renderHook(() => useUploadLink(), {
    wrapper,
  });
  const onRejected = jest.fn();
  act(() => {
    const fileLike = {
      name: 'foo.jpg',
      type: 'image/jpeg',
      uri: 'file://foo.jpg',
    };
    result.current.upload(fileLike).catch(onRejected);
  });
  expect(result.current.uploading).toBe(true);
  await waitForNextUpdate();
  expect(result.current.uploading).toBe(false);
  expect(onRejected).toHaveBeenCalled();
});
