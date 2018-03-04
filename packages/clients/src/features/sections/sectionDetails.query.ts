import gql from 'graphql-tag';
import { SectionFragments } from './sectionFragments';

export const SECTION_DETAILS = gql`
  query sectionDetails($sectionId: ID, $language: String) {
    section(id: $sectionId, language: $language) {
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
  ${SectionFragments.Media}
  ${SectionFragments.Meta}
  ${SectionFragments.POIs}
  ${SectionFragments.Tags}
`;
