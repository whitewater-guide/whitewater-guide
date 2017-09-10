import gql from 'graphql-tag';
import { RegionFragments } from './regionFraments';

const REGION_DETAILS = gql`
  query regionDetails($id: ID!, $language:String, $withBounds: Boolean!, $withPOIs: Boolean!) {
    region(id: $id, language: $language) {
      ...RegionCore
      ...RegionDescription
      ...RegionPOIs @include(if: $withPOIs)
      ...RegionBounds @include(if: $withBounds)
    }
  }
  ${RegionFragments.Core}
  ${RegionFragments.Description}
  ${RegionFragments.POIs}
  ${RegionFragments.Bounds}
`;

export default REGION_DETAILS;
