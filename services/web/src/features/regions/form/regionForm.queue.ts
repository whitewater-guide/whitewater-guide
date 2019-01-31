import { RegionFragments } from '@whitewater-guide/clients';
import gql from 'graphql-tag';

const REGION_FORM_QUEUE = gql`
  query regionForm($regionId: ID) {
    region(id: $regionId) {
      id
      name
      season
      seasonNumeric
      ...RegionDescription
      ...RegionPOIs
      ...RegionBounds
    }
  }
  ${RegionFragments.Description}
  ${RegionFragments.POIs}
  ${RegionFragments.Bounds}
`;

export default REGION_FORM_QUEUE;