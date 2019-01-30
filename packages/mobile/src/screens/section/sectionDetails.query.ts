import { SectionFragments } from '@whitewater-guide/clients';
import { Section } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const SECTION_DETAILS = gql`
  query sectionDetails($sectionId: ID) {
    section(id: $sectionId) {
      ...SectionCore
      ...SectionDescription
      ...SectionEnds
      ...SectionShape
      ...SectionMeasurements
      ...SectionMeta
      ...SectionPOIs
      ...SectionTags
      ...SectionMedia
    }
  }
  ${SectionFragments.Core}
  ${SectionFragments.Description}
  ${SectionFragments.Ends}
  ${SectionFragments.Shape}
  ${SectionFragments.Measurements}
  ${SectionFragments.Meta}
  ${SectionFragments.POIs}
  ${SectionFragments.Tags}
  ${SectionFragments.Media}
`;

export interface Result {
  section: Section;
}

export interface Vars {
  sectionId: string;
}
