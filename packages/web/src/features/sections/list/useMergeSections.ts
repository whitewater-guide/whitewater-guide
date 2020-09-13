import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';

const MERGE_SECTIONS = gql`
  mutation mergeSections($sourceId: ID!, $destinationId: ID!) {
    mergeSections(sourceId: $sourceId, destinationId: $destinationId)
  }
`;

interface Vars {
  sourceId: string;
  destinationId: string;
}

export default function useMergeSections() {
  const [mutate, { loading }] = useMutation<any, Vars>(MERGE_SECTIONS, {
    refetchQueries: ['listSections'],
  });
  return {
    mergeSections: (sourceId: string, destinationId: string) =>
      mutate({ variables: { sourceId, destinationId } }),
    loading,
  };
}
