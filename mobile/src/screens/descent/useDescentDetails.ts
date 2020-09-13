import { Descent } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';

const DESCENT_DETAILS_QUERY = gql`
  query descentDetails($descentId: ID) {
    descent(id: $descentId) {
      id

      startedAt
      duration
      level {
        value
        unit
      }
      comment
      public

      createdAt
      updatedAt

      section {
        id
        name
        river {
          id
          name
        }
        region {
          id
          name
        }
        flows {
          minimum
          maximum
          optimum
          impossible
          approximate
        }
        gauge {
          id
          name
          levelUnit
          flowUnit
        }
      }
    }
  }
`;

interface QVars {
  descentId?: string | null;
  shareToken?: string | null;
}

interface QResult {
  descent?: Descent;
}

export default function useDescentDetails(descentId: string) {
  return useQuery<QResult, QVars>(DESCENT_DETAILS_QUERY, {
    variables: { descentId },
    fetchPolicy: 'cache-and-network',
  });
}
