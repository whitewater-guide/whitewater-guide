import { Region } from '@whitewater-guide/commons';
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
      ...RegionLicense
      sku
    }
  }
  ${RegionFragments.Core}
  ${RegionFragments.Description}
  ${RegionFragments.POIs}
  ${RegionFragments.Bounds}
  ${RegionFragments.Flags}
  ${RegionFragments.License}
  ${RegionFragments.Banners(width)}
`;

export interface RegionDetailsVars {
  regionId?: string;
}

export interface RegionDetailsResult {
  region: Region | null;
}
