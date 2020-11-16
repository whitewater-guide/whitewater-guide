import { SectionFragments } from '@whitewater-guide/clients';
import {
  Connection,
  Page,
  Section,
  SectionsFilter,
} from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { PHOTO_SIZE_PX } from '../media';

export const OFFLINE_SECTIONS = gql`
  query listSections($page: Page, $filter: SectionsFilter) {
    sections(page: $page, filter: $filter)
      @connection(key: "offline_sections", filter: ["filter"]) {
      nodes {
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
      count
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

export interface Vars {
  page?: Page;
  filter?: SectionsFilter;
}

export interface Result {
  sections: Required<Connection<Section>>;
}
