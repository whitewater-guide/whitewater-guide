import {
  LogbookDescent,
  LogbookDescentAll,
} from '@whitewater-guide/logbook-schema';
import gql from 'graphql-tag';

export const DESCENT_FORM_QUERY = gql`
  query getLogbookDescent($descentId: ID, $shareToken: String) {
    logbookDescent(id: $descentId, shareToken: $shareToken) {
      ...logbookDescentAll
    }
  }
  ${LogbookDescentAll}
`;

export interface QVars {
  descentId?: string | null;
  shareToken?: string | null;
}

export interface QResult {
  logbookDescent?: LogbookDescent;
}
