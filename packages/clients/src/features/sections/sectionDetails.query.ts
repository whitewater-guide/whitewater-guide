import gql from 'graphql-tag';
import { SectionFragments } from './sectionFragments';

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
`;
