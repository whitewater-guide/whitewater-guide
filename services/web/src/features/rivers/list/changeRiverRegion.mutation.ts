import { River } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const CHANGE_RIVER_REGION = gql`
  mutation ChangeRiverRegion($riverId: ID!, $regionId: ID!) {
    changeRiverRegion(riverId: $riverId, regionId: $regionId) {
      id
      region {
        id
      }
    }
  }
`;

export interface Vars {
  riverId: string;
  regionId: string;
}

export interface Result {
  changeRiverRegion: Pick<River, 'id' | 'region'>;
}
