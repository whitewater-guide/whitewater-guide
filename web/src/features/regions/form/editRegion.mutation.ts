import { gql } from 'react-apollo';
import { RegionFragments } from '../../../ww-clients/features/regions';

const upsertRegion = gql`
  mutation upsertRegion($region: RegionInput!, $language:String){
    upsertRegion(region: $region, language: $language){
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

export default upsertRegion;
