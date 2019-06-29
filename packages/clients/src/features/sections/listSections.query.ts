import {
  Connection,
  Page,
  Section,
  SectionsFilter,
} from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { SectionFragments } from './sectionFragments';

export const LIST_SECTIONS = gql`
  query listSections($page: Page, $filter: SectionsFilter) {
    sections(page: $page, filter: $filter)
      @connection(key: "sections", filter: ["filter"]) {
      nodes {
        ...SectionCore
        ...SectionEnds
        ...SectionMeasurements
        ...SectionTags
        updatedAt
      }
      count
    }
  }
  ${SectionFragments.Core}
  ${SectionFragments.Ends}
  ${SectionFragments.Measurements}
  ${SectionFragments.Tags}
`;

export interface ListSectionsVars {
  page?: Page;
  filter?: SectionsFilter;
}

export interface ListSectionsResult {
  sections: Required<Connection<Section>>;
}
