import { SectionFragments } from '@whitewater-guide/clients';
import gql from 'graphql-tag';

export const SECTION_FORM_QUERY = gql`
  query sectionForm($sectionId: ID, $riverId: ID, $regionId: ID) {
    section(id: $sectionId) {
      ...SectionCore
      ...SectionDescription
      ...SectionShape
      ...SectionMeta
      ...SectionPOIs
      ...SectionTags
      gauge {
        id
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
    river(id: $riverId) {
      id
      name
    }
    region(id: $regionId) {
      id
      name
      bounds
      gauges {
        nodes {
          id
          name
        }
      }
    }
    tags {
      id
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
