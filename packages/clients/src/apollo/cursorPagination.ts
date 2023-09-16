import type { FieldPolicy, Reference } from '@apollo/client';
import uniqBy from 'lodash/uniqBy';

/**
 * Custom pagination helper for our weird cursor pagination style that we use in whitewater.guide for descents
 *
 * @param keyArgs
 * @returns
 */
export default function cursorPagination<T = Reference>(
  keyArgs: FieldPolicy<T>['keyArgs'] = false,
) {
  return {
    keyArgs,
    merge(existing: any, incoming: any) {
      const newEdges = incoming?.edges ?? [];
      const oldEdges = existing?.edges ?? [];
      const pageInfo = incoming?.pageInfo;

      return newEdges.length
        ? {
            __typename: incoming?.__typename,
            edges: uniqBy([...oldEdges, ...newEdges], 'cursor'),
            pageInfo: { ...pageInfo },
          }
        : existing;
    },
  };
}
