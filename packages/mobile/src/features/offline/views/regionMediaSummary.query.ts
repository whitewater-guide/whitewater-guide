import gql from 'graphql-tag';
import { Region } from '../../../ww-commons';

export const REGION_MEDIA_SUMMARY = gql`
  query regionMediaSummary($regionId: ID) {
    region(id: $regionId) {
      id
      mediaSummary {
        photo {
          count
          size
        }
        video {
          count
          size
        }
        blog {
          count
          size
        }
      }
    }
  }
`;

export interface Result {
  region: Pick<Region, 'id' | 'mediaSummary'> | null;
}

export interface Vars {
  regionId?: string;
}
