import { Section } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { SectionFragments } from './sectionFragments';

export const SECTION_DETAILS = gql`
  query sectionDetails($sectionId: ID) {
    section(id: $sectionId) {
      ...SectionCore
      ...SectionRegionId
      ...SectionDescription
      ...SectionEnds
      ...SectionShape
      ...SectionMeasurements
      ...SectionMeta
      ...SectionPOIs
      ...SectionTags
      ...SectionLicense
    }
  }
  ${SectionFragments.Core}
  ${SectionFragments.RegionId}
  ${SectionFragments.Description}
  ${SectionFragments.Ends}
  ${SectionFragments.Shape}
  ${SectionFragments.Measurements}
  ${SectionFragments.Meta}
  ${SectionFragments.POIs}
  ${SectionFragments.Tags}
  ${SectionFragments.License}
`;

export interface SectionDetailsVars {
  sectionId?: string;
}

export interface SectionDetailsResult {
  section: Section | null;
}
