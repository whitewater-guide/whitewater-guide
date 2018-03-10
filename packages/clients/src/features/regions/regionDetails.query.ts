import gql from 'graphql-tag';
import { RegionFragments } from './regionFraments';

export const REGION_DETAILS = gql`
  query regionDetails($regionId: ID, $language: String) {
    region(id: $regionId, language: $language) {
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
