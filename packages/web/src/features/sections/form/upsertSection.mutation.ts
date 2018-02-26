import gql from 'graphql-tag';
import { SectionFragments } from '../../../ww-clients/features/sections';

const UPSERT_SECTION = gql`
  mutation upsertSection($section: SectionInput!, $language: String){
    upsertSection(section: $section, language: $language){
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

export default UPSERT_SECTION;
