import gql from 'graphql-tag';
import { useCallback } from 'react';
import { useMutation } from 'react-apollo';

const REMOVE_GROUP = gql`
  mutation removeGroup($id: String!) {
    removeGroup(id: $id)
  }
`;

interface MVars {
  id: string;
}

export default () => {
  const [mutate] = useMutation<any, MVars>(REMOVE_GROUP);
  return useCallback(
    (id: string) =>
      mutate({
        variables: { id },
        refetchQueries: ['listGroups'],
      }),
    [mutate],
  );
};
