import { RegionFragments } from '@whitewater-guide/clients';
import { Region, RegionInput } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const UPSERT_REGION = gql`
  mutation upsertRegion($region: RegionInput!) {
    upsertRegion(region: $region) {
      ...RegionCore
      ...RegionPOIs
      ...RegionBounds
      ...RegionDescription
    }
  }
  ${RegionFragments.Core}
  ${RegionFragments.POIs}
  ${RegionFragments.Bounds}
  ${RegionFragments.Description}
`;

export interface MVars {
  region: RegionInput;
}

export interface MResult {
  upsertRegion: Region;
}
