import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';

const SUGGESTIONS_COUNT_QUERY = gql`
  query suggestionsCount {
    suggestions(filter: { status: [pending] }) {
      count
    }
    suggestedSections(filter: { status: [pending] }) {
      count
    }
  }
`;

interface QResult {
  suggestions?: {
    count: number;
  };
  suggestedSections?: {
    count: number;
  };
}

export default (): number | null => {
  const { data } = useQuery<QResult>(SUGGESTIONS_COUNT_QUERY, {
    fetchPolicy: 'cache-and-network',
  });
  if (data && data.suggestions && data.suggestedSections) {
    return data.suggestions.count + data.suggestedSections.count;
  }
  return null;
};
