import gql from 'graphql-tag';
import { RegionFragments } from '../../../ww-clients/features/regions';

const UPSERT_REGION = gql`
  mutation upsertRegion($region: RegionInput!){
    upsertRegion(region: $region){
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
