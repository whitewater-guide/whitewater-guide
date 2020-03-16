import { SectionFragments } from '@whitewater-guide/clients';
import { Section } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { PHOTO_SIZE_PX } from '../../features/media';

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
      ...SectionMedia
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
  ${SectionFragments.Media(PHOTO_SIZE_PX, PHOTO_SIZE_PX)}
`;

export interface Result {
  section: Section;
}

export interface Vars {
  sectionId: string;
}
