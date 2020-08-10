import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';

const SUGGESTIONS_COUNT_QUERY = gql`
  query suggestionsCount {
    suggestions(filter: { status: [pending] }) {
      count
    }
    sections(filter: { verified: false, editable: true }) {
      count
    }
  }
`;

interface QResult {
  suggestions?: {
    count: number;
  };
  sections?: {
    count: number;
  };
}

export default (): number | null => {
  const { data } = useQuery<QResult>(SUGGESTIONS_COUNT_QUERY, {
    fetchPolicy: 'cache-and-network',
  });
  if (data && data.suggestions && data.sections) {
    return data.suggestions.count + data.sections.count;
  }
  return null;
};
