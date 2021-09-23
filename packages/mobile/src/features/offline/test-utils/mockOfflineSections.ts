import { MockedResponse } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';

import { PHOTO_SIZE_PX } from '~/features/media';

export const TEST_OFFLINE_SECTIONS = gql`
  query listSections(
    $page: Page
    $filter: SectionsFilter
    $thumbWidth: Int
    $thumbHeight: Int
  ) {
    sections(page: $page, filter: $filter) {
      nodes {
        id
        media {
          nodes {
            kind
            image
            thumb: image(width: $thumbWidth, height: $thumbHeight)
          }
        }
      }
      count
    }
  }
`;

export const TEST_REGION_ID = '__region_id__';

export const mockReq = (i: number, regionId = TEST_REGION_ID) => ({
  query: TEST_OFFLINE_SECTIONS,
  variables: {
    filter: { regionId },
    page: { offset: i, limit: 1 },
    thumbHeight: PHOTO_SIZE_PX,
    thumbWidth: PHOTO_SIZE_PX,
  },
});

export const mockSuccess = (i: number, regionId = TEST_REGION_ID) => ({
  request: mockReq(i, regionId),
  result: {
    data: {
      sections: {
        __typename: 'SectionsList',
        nodes: [
          {
            __typename: 'Section',
            id: `${i + 1}`,
            media: {
              __typename: 'MediaList',
              nodes: [
                {
                  __typename: 'Media',
                  kind: 'photo',
                  image: `photo${i + 1}.jpg`,
                  thumb: `thumb${i + 1}.jpg`,
                },
              ],
            },
          },
        ],
        count: 3,
      },
    },
  },
});

export const happyPath: MockedResponse[] = [
  mockSuccess(0),
  mockSuccess(1),
  mockSuccess(2),
];

export const netErrorPath1: MockedResponse[] = [
  {
    request: mockReq(0),
    error: new Error('network error'),
  },
  mockSuccess(0),
  mockSuccess(1),
  mockSuccess(2),
];

export const netErrorPath2: MockedResponse[] = [
  mockSuccess(0),
  {
    request: mockReq(1),
    error: new Error('network error'),
  },
  mockSuccess(1),
  mockSuccess(2),
];

export const graphqlErrorPath1: MockedResponse[] = [
  {
    request: mockReq(0),
    result: {
      errors: [new GraphQLError('Error!')],
    },
  },
  mockSuccess(0),
  mockSuccess(1),
  mockSuccess(2),
];

export const graphqlErrorPath2: MockedResponse[] = [
  mockSuccess(0),
  {
    request: mockReq(1),
    result: {
      errors: [new GraphQLError('Error!')],
    },
  },
  mockSuccess(1),
  mockSuccess(2),
];
