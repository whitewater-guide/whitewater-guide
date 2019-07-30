import { Section, SectionAdminSettings } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const ADMINISTRATE_SECTION_MUTATION = gql`
  mutation administrateSection(
    $sectionId: ID!
    $settings: SectionAdminSettings!
  ) {
    administrateSection(id: $sectionId, settings: $settings) {
      id
      demo
    }
  }
`;

export interface MVars {
  sectionId: string;
  settings: SectionAdminSettings;
}

export interface MResult {
  administrateSection: Pick<Section, 'id' | 'demo'>;
}
