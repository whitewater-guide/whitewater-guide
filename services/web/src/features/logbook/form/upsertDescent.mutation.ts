import {
  LogbookDescentAll,
  MutationUpsertLogbookDescentArgs,
} from '@whitewater-guide/logbook-schema';
import gql from 'graphql-tag';

export const UPSERT_DESCENT = gql`
  mutation upsertLogbookDescent(
    $descent: LogbookDescentInput!
    $shareToken: String
  ) {
    upsertLogbookDescent(descent: $descent, shareToken: $shareToken) {
      ...logbookDescentAll
    }
  }
  ${LogbookDescentAll}
`;

export type MVars = MutationUpsertLogbookDescentArgs;
