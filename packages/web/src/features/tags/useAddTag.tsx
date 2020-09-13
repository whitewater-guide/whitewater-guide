import { TagInput } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { useCallback } from 'react';
import { useMutation } from 'react-apollo';

const UPSERT_TAG = gql`
  mutation upsertTag($tag: TagInput!) {
    upsertTag(tag: $tag) {
      id
      name
      category
    }
  }
`;

interface MVars {
  tag: TagInput;
}

export default () => {
  const [mutate] = useMutation<any, MVars>(UPSERT_TAG);
  return useCallback(
    (tag: TagInput) =>
      mutate({
        variables: { tag },
        refetchQueries: ['listTags'],
      }),
    [mutate],
  );
};
