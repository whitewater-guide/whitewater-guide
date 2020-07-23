import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import { Descent } from '@whitewater-guide/commons';

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

export default (descentId: string) =>
  useQuery<QResult, QVars>(DESCENT_DETAILS_QUERY, {
    variables: { descentId },
  });
