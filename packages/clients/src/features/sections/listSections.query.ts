import gql from 'graphql-tag';
import { SectionFragments } from './sectionFragments';

export const LIST_SECTIONS = gql`
  query listSections($page: Page, $filter: SectionsFilter) {
    sections(page: $page, filter: $filter) @connection(key: "sections", filter: ["filter"])  {
      nodes {
        ...SectionCore
        ...SectionEnds
        ...SectionShape
        ...SectionMeasurements
        ...SectionTags
        updatedAt
      }
      count
    }
  }
  ${SectionFragments.Core}
  ${SectionFragments.Ends}
  ${SectionFragments.Shape}
  ${SectionFragments.Measurements}
  ${SectionFragments.Tags}
`;
