import {
  LogbookDescent,
  LogbookDescentAll,
} from '@whitewater-guide/logbook-schema';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';

const DESCENT_DETAILS_QUERY = gql`
  query logbookDescentDetails($descentId: ID) {
    logbookDescent(id: $descentId) {
      ...logbookDescentAll
    }
  }
  ${LogbookDescentAll}
`;

interface QVars {
  descentId?: string | null;
  shareToken?: string | null;
}

interface QResult {
  logbookDescent?: LogbookDescent;
}

export default (descentId: string) =>
  useQuery<QResult, QVars>(DESCENT_DETAILS_QUERY, {
    variables: { descentId },
  });
