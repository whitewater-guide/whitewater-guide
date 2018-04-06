import gql from 'graphql-tag';
import { RegionFragments } from '../../../ww-clients/features/regions';

const REGION_FORM_QUEUE = gql`
  query regionForm($regionId: ID) {
    region(id: $regionId) {
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

export default REGION_FORM_QUEUE;
