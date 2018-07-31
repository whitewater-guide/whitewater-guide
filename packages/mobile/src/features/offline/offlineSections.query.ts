import gql from 'graphql-tag';
import { Page } from '../../ww-clients/apollo';
import { SectionFragments } from '../../ww-clients/features/sections';
import { Connection, Section } from '../../ww-commons';

export const OFFLINE_SECTIONS = gql`
  query listSections($page: Page, $regionId: ID) {
    sections(page: $page, filter: { regionId: $regionId }) @connection(key: "offline_sections", filter: ["filter"])  {
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
