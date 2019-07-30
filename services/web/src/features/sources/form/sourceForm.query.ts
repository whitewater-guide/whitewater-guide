import {
  Connection,
  NamedNode,
  Script,
  Source,
} from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const SOURCE_FORM_QUERY = gql`
  query sourceForm($sourceId: ID) {
    source(id: $sourceId) {
      id
      name
      termsOfUse
      script
      cron
      harvestMode
      requestParams
      url
      regions {
        nodes {
          id
          name
        }
      }
    }

    regions {
      nodes {
        id
        name
      }
      count
    }

    scripts {
      id
      name
      harvestMode
      error
    }
  }
`;

export interface QVars {
  sourceId?: string;
}

export interface QResult {
  source: Pick<
    Source,
    | 'id'
    | 'name'
    | 'termsOfUse'
    | 'script'
    | 'cron'
    | 'harvestMode'
    | 'requestParams'
    | 'url'
  > & { regions: Connection<NamedNode> };
  regions: Connection<NamedNode>;
  scripts: Script[];
}
