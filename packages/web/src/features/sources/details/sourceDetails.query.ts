import { Source } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const SOURCE_DETAILS = gql`
  query sourceDetails($sourceId: ID!) {
    source(id: $sourceId) {
      id
      name
      termsOfUse
      script
      cron
      url
      enabled
      regions {
        nodes {
          id
          name
        }
      }
    }
  }
`;

export interface QVars {
  sourceId: string;
}

export interface QResult {
  source: Source | null;
}
