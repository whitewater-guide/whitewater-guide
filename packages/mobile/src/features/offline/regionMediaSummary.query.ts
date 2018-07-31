import gql from 'graphql-tag';
import { Region } from '../../ww-commons';

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
      sections {
        count
      }
    }
  }
`;

export interface Result {
  region: Pick<Region, 'id' | 'mediaSummary' | 'sections'> | null;
}

export interface Vars {
  regionId?: string;
}