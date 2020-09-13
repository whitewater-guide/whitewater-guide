import gql from 'graphql-tag';
import { useCallback } from 'react';
import { useMutation } from 'react-apollo';

const AUTOFILL_MUTATION = gql`
  mutation autofillSource($sourceId: ID!) {
    autofillSource(id: $sourceId) {
      id
    }
  }
`;

interface MVars {
  sourceId: string;
}

export default (sourceId: string) => {
  const [mutate] = useMutation<any, MVars>(AUTOFILL_MUTATION, {
    refetchQueries: ['listGauges'],
  });
  return useCallback(() => mutate({ variables: { sourceId } }), [
    mutate,
    sourceId,
  ]);
};
