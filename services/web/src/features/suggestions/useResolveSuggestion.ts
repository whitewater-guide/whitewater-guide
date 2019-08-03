import { SuggestionStatus } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { useMemo } from 'react';
import { useMutation } from 'react-apollo';

const RESOLVE_SUGGESTION_MUTATION = gql`
  mutation resolveSuggestion($id: ID!, $status: SuggestionStatus!) {
    resolveSuggestion(id: $id, status: $status) {
      id
      status
    }
  }
`;

interface MVars {
  id: string;
  status: SuggestionStatus;
}

const useResolveSuggestion = (id: string, callback: () => void) => {
  const [mutate] = useMutation<any, MVars>(RESOLVE_SUGGESTION_MUTATION);
  return useMemo(
    () => ({
      accept: () =>
        mutate({ variables: { id, status: SuggestionStatus.ACCEPTED } }).then(
          () => callback(),
        ),
      reject: () =>
        mutate({ variables: { id, status: SuggestionStatus.REJECTED } }).then(
          () => callback(),
        ),
    }),
    [id, callback, mutate],
  );
};

export default useResolveSuggestion;
