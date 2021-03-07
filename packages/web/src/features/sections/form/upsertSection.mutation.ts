import { SectionFragments } from '@whitewater-guide/clients';
import { Section, SectionInput } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const UPSERT_SECTION = gql`
  mutation upsertSection($section: SectionInput!) {
    upsertSection(section: $section) {
      ...SectionCore
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
  ${SectionFragments.Description}
  ${SectionFragments.Ends}
  ${SectionFragments.Shape}
  ${SectionFragments.Measurements}
  ${SectionFragments.Meta}
  ${SectionFragments.POIs}
  ${SectionFragments.Tags}
  ${SectionFragments.License}
`;

export interface MVars {
  section: SectionInput;
}

export interface MResult {
  upsertSection: Section | null;
}
