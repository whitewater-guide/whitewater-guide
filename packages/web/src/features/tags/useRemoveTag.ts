import gql from 'graphql-tag';
import { useCallback } from 'react';
import { useMutation } from 'react-apollo';

const REMOVE_TAG = gql`
  mutation upsertRegion($id: String!) {
    removeTag(id: $id)
  }
`;

interface MVars {
  id: string;
}

export default () => {
  const [mutate] = useMutation<any, MVars>(REMOVE_TAG);
  return useCallback(
    (id: string) =>
      mutate({
        variables: { id },
        refetchQueries: ['listTags'],
      }),
    [mutate],
  );
};
