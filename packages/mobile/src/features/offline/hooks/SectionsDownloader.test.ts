import { mockSingleLink } from '@apollo/react-testing';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';

import {
  graphqlErrorPath2,
  happyPath,
  netErrorPath2,
  TEST_OFFLINE_SECTIONS,
  TEST_REGION_ID,
} from '~/features/offline/test-utils/mockOfflineSections';

import { PhotoChannel } from '../utils';
import { SectionsDownloader } from './SectionsDownloader';

it('should merge all downloaded sections', async () => {
  const apollo = new ApolloClient({
    link: mockSingleLink(...happyPath),
    cache: new InMemoryCache(),
  });
  const onProgress = jest.fn();
  const downloader = new SectionsDownloader({
    apollo,
    onProgress,
    photoChannel: new PhotoChannel(),
    limit: 1,
    query: TEST_OFFLINE_SECTIONS,
  });
  await downloader.download(TEST_REGION_ID, 3);
  expect(onProgress).toHaveBeenCalledWith({ data: [3, 3] });
  const result = apollo.readQuery({
    query: TEST_OFFLINE_SECTIONS,
    variables: { filter: { regionId: TEST_REGION_ID } },
  });
  expect(result.sections.nodes).toHaveLength(3);
});

it.each([
  ['network error', netErrorPath2],
  ['graphql error', graphqlErrorPath2],
])('should break photos channel on %s', async (_, mocks) => {
  const apollo = new ApolloClient({
    link: mockSingleLink(...mocks),
    cache: new InMemoryCache(),
  });
  const photoChannel = new PhotoChannel();
  const downloader = new SectionsDownloader({
    apollo,
    onProgress: jest.fn(),
    photoChannel,
    limit: 1,
    query: TEST_OFFLINE_SECTIONS,
  });
  await expect(downloader.download(TEST_REGION_ID, 3)).rejects.toThrow();
  expect(photoChannel.closed).toBe(true);
  expect(photoChannel.broken).toBe(true);
});
