import { SectionFragments } from '@whitewater-guide/clients';
import { Connection, Page, Section } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const OFFLINE_SECTIONS = gql`
  query listSections($page: Page, $regionId: ID) {
    sections(page: $page, filter: { regionId: $regionId })
      @connection(key: "offline_sections", filter: ["filter"]) {
      nodes {
        ...SectionCore
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
  ${SectionFragments.Description}
  ${SectionFragments.Ends}
  ${SectionFragments.Shape}
  ${SectionFragments.Measurements}
  ${SectionFragments.Meta}
  ${SectionFragments.POIs}
  ${SectionFragments.Tags}
  ${SectionFragments.Media}
`;

export interface Vars {
  page?: Page;
  regionId: string;
}

export interface Result {
  sections: Required<Connection<Section>>;
}
