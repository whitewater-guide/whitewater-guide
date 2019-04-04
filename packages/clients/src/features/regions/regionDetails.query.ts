import gql from 'graphql-tag';
import { RegionFragments } from './regionFraments';

export const REGION_DETAILS = (width?: number) => gql`
  query regionDetails($regionId: ID) {
    region(id: $regionId) {
      ...RegionCore
      ...RegionDescription
      ...RegionPOIs
      ...RegionBounds
      ...RegionFlags
      ...RegionBanners
      sku
    }
  }
  ${RegionFragments.Core}
  ${RegionFragments.Description}
  ${RegionFragments.POIs}
  ${RegionFragments.Bounds}
  ${RegionFragments.Flags}
  ${RegionFragments.Banners(width)}
`;
