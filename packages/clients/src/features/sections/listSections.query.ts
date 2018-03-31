import gql from 'graphql-tag';
import { SectionFragments } from './sectionFragments';

export const LIST_SECTIONS = gql`
  query listSections($page: Page, $filter: SectionsFilter) {
    sections(page: $page, filter: $filter) {
      nodes {
        ...SectionCore
        ...SectionEnds
        ...SectionShape
        ...SectionMeasurements
        updatedAt
      }
      count
    }
  }
  ${SectionFragments.Core}
  ${SectionFragments.Ends}
  ${SectionFragments.Shape}
  ${SectionFragments.Measurements}
`;
