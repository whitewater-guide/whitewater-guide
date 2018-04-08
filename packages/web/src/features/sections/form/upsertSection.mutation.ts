import gql from 'graphql-tag';
import { SectionFragments } from '../../../ww-clients/features/sections';
import { Section } from '../../../ww-commons';

export const UPSERT_SECTION = gql`
  mutation upsertSection($section: SectionInput!){
    upsertSection(section: $section){
      ...SectionCore
      ...SectionDescription
      ...SectionEnds
      ...SectionShape
      ...SectionMeasurements
      ...SectionMeta
      ...SectionPOIs
      ...SectionTags
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
`;

export interface UpsertSectionResult {
  upsertSection: Section | null;
}
