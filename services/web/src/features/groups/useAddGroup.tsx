import { GroupInput } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { useCallback } from 'react';
import { useMutation } from 'react-apollo';

const UPSERT_GROUP = gql`
  mutation upsertGroup($group: GroupInput!) {
    upsertGroup(group: $group) {
      id
      name
      sku
    }
  }
`;

interface MVars {
  group: GroupInput;
}

export default () => {
  const [mutate] = useMutation<any, MVars>(UPSERT_GROUP);
  return useCallback(
    (group: GroupInput) =>
      mutate({
        variables: { group },
        refetchQueries: ['listGroups'],
      }),
    [mutate],
  );
};
