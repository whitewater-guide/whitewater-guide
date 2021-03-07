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
  License,
  Media,
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
      copyright
      license {
        slug
        name
        url
      }
      media {
        nodes {
          id
          description
          copyright
          url
          kind
          resolution
          weight
        }
      }
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
      license {
        slug
        name
        url
      }
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
}

export interface QResult {
  section: SectionCore &
    SectionDescription &
    SectionShape &
    SectionMeta &
    SectionPOIs &
    Pick<Section, 'copyright' | 'license'> &
    SectionTags & { gauge: NamedNode | null } & Pick<
      Section,
      'levels' | 'flows' | 'flowsText'
    > & {
      verified?: boolean | null;
      media: {
        nodes: Array<
          Pick<
            Media,
            | '__typename'
            | 'id'
            | 'description'
            | 'copyright'
            | 'license'
            | 'url'
            | 'kind'
            | 'resolution'
            | 'weight'
          >
        >;
      };
    };
  river: NamedNode | null;
  region: NamedNode & {
    bounds: Region['bounds'];
    license: License | null;
  };
  gauges: Required<Connection<NamedNode>>;
  tags: Tag[];
}
