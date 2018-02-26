import gql from 'graphql-tag';
import { SectionFragments } from '../../../ww-clients/features/sections';

export const SECTION_FORM_QUERY = gql`
  query sectionForm($sectionId: ID, $riverId: ID, $regionId: ID, $language: String) {
    section(id: $sectionId, language: $language) {
      ...SectionCore
      ...SectionDescription
      ...SectionShape
      ...SectionMeta
      ...SectionPOIs
      ...SectionTags
      gauge {
        id
        language
        name
      }
      levels {
        ...GaugeBindingAll
      }
      flows {
        ...GaugeBindingAll
      }
      flowsText
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
  ${SectionFragments.GaugeBinding.All}
  ${SectionFragments.Meta}
  ${SectionFragments.POIs}
  ${SectionFragments.Tags}
`;
