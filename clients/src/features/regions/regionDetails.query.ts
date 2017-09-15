import gql from 'graphql-tag';
import { RegionFragments } from './regionFraments';

const REGION_DETAILS = gql`
  query regionDetails($id: ID!, $language:String) {
    region(id: $id, language: $language) {
      ...RegionCore
      ...RegionDescription
      ...RegionPOIs
      ...RegionBounds
    }
  }
  ${RegionFragments.Core}
  ${RegionFragments.Description}
  ${RegionFragments.POIs}
  ${RegionFragments.Bounds}
`;

export default REGION_DETAILS;
