import { Connection, Source } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const LIST_SOURCES = gql`
  query listSources {
    sources {
      nodes {
        id
        name
        enabled
        cron
        gauges {
          count
        }
        status {
          success
          count
          timestamp
          error
        }
      }
      count
    }
  }
`;

export interface QResult {
  sources: Required<Connection<Source>>;
}
