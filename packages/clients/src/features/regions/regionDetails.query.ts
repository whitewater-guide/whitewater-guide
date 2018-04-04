import gql from 'graphql-tag';
import { RegionFragments } from './regionFraments';

export const REGION_DETAILS = gql`
  query regionDetails($regionId: ID) {
    region(id: $regionId) {
      ...RegionCore
      ...RegionDescription
      ...RegionPOIs
      ...RegionBounds
      ...RegionFlags
    }
  }
  ${RegionFragments.Core}
  ${RegionFragments.Description}
  ${RegionFragments.POIs}
  ${RegionFragments.Bounds}
  ${RegionFragments.Flags}
`;
