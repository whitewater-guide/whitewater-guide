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
  SectionInput,
  Tag,
} from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const SECTION_FORM_QUERY = gql`
  query sectionForm(
    $sectionId: ID
    $riverId: ID
    $regionId: ID
    $fromSuggestedId: ID
  ) {
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
    suggestedSection(id: $fromSuggestedId) {
      id
      section
    }
    river(id: $riverId) {
      id
      name
    }
    region(id: $regionId) {
      id
      name
      bounds
    }
    gauges(filter: { regionId: $regionId }) {
      nodes {
        id
        name
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
  fromSuggestedId?: string;
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
  };
  gauges: Required<Connection<NamedNode>>;
  suggestedSection: {
    id: string;
    section: SectionInput;
  } | null;
  tags: Tag[];
}
