import { Source, SourceInput } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const UPSERT_SOURCE = gql`
  mutation upsertSource($source: SourceInput!) {
    upsertSource(source: $source) {
      id
      name
      termsOfUse
      script
      cron
      url
    }
  }
`;

export interface MVars {
  source: SourceInput;
}

export interface MResult {
  upsertSource: Source;
}
