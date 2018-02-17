import gql from 'graphql-tag';
import { SectionFragments } from '../../../ww-clients/features/sections';

export const SECTION_FORM_QUERY = gql`
  query sectionForm($sectionId: ID, $riverId: ID, $regionId: ID, $language: String) {
    section(id: $sectionId, language: $language) {
      ...SectionCore
      ...SectionDescription
      ...SectionShape
      ...SectionMeasurements
      ...SectionMeta
      ...SectionPOIs
      ...SectionTags
    }
    river(id: $riverId, language: $language) {
      id
      name
      language
    }
    region(id: $regionId, language: $language) {
      id
      name
      language
      bounds
      gauges {
        nodes {
          id
          name
          language
        }
      }
    }
    tags(language: $language) {
      id
      language
      name
      category
    }
  }
  ${SectionFragments.Core}
  ${SectionFragments.Description}
  ${SectionFragments.Shape}
  ${SectionFragments.Measurements}
  ${SectionFragments.Meta}
  ${SectionFragments.POIs}
  ${SectionFragments.Tags}
`;
