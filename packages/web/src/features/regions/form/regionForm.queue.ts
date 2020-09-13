import { RegionFragments } from '@whitewater-guide/clients';
import { Region } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const REGION_FORM_QUERY = gql`
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

export interface QVars {
  regionId?: string;
}

export interface QResult {
  region: Region | null;
}
