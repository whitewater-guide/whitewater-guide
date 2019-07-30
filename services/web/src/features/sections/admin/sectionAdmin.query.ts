import { Section } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const SECTION_ADMIN_QUERY = gql`
  query sectionAdminSettings($sectionId: ID) {
    settings: section(id: $sectionId) {
      id
      demo
    }
  }
`;

export interface QVars {
  sectionId: string;
}

export interface QResult {
  settings: Pick<Section, 'id' | 'demo'>;
}
