import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';

const SUGGESTIONS_COUNT_QUERY = gql`
  query suggestionsCount {
    suggestions(filter: { status: [pending] }) {
      count
    }
  }
`;

interface QResult {
  suggestions?: {
    count: number;
  };
}

export default (): number | null => {
  const { data } = useQuery<QResult>(SUGGESTIONS_COUNT_QUERY, {
    fetchPolicy: 'cache-and-network',
  });
  return data && data.suggestions ? data.suggestions.count : null;
};
