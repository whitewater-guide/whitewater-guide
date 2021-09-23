import { FieldPolicy, Reference } from '@apollo/client';

import { updateList } from './updateList';

/**
 * Custom pagination helper for our weird offset pagination style that we use in whitewater.guide
 *
 * Used to merge types that look like `{nodes, count }`
 * @param keyArgs
 * @returns
 */
export default function nodesPagination<T = Reference>(
  keyArgs: FieldPolicy<T>['keyArgs'] = false,
) {
  return {
    keyArgs,
    merge(existing: any, incoming: any) {
      const nodes = updateList(existing?.nodes ?? [], incoming?.nodes ?? []);
      const result = {
        __typename: incoming?.__typename,
        count: Math.max(nodes.length, incoming?.count ?? 0),
        nodes,
      };
      return result;
    },
  };
}
