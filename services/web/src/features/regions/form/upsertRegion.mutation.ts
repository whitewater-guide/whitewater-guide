import { RegionFragments } from '@whitewater-guide/clients';
import gql from 'graphql-tag';

const UPSERT_REGION = gql`
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

export default UPSERT_REGION;
