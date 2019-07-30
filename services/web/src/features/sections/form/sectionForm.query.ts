import {
  SectionCore,
  SectionDescription,
  SectionFragments,
  SectionMeta,
  SectionPOIs,
  SectionShape,
  SectionTags,
} from '@whitewater-guide/clients';
import {
  Connection,
  NamedNode,
  Region,
  Section,
  Tag,
} from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const SECTION_FORM_QUERY = gql`
  query sectionForm($sectionId: ID, $riverId: ID, $regionId: ID) {
    section(id: $sectionId) {
      ...SectionCore
      ...SectionDescription
      ...SectionShape
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
  ${SectionFragments.POIs}
  ${SectionFragments.Tags}
`;

export interface QVars {
  sectionId?: string;
  riverId?: string;
  regionId?: string;
}

export interface QResult {
  section: SectionCore &
    SectionDescription &
    SectionShape &
    SectionMeta &
    SectionPOIs &
    SectionTags & { gauge: NamedNode | null } & Pick<
      Section,
      'levels' | 'flows' | 'flowsText'
    >;
  river: NamedNode | null;
  region: NamedNode & {
    bounds: Region['bounds'];
    gauges: Connection<NamedNode>;
  };
  tags: Tag[];
}
