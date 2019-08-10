import { BannerInput } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const UPSERT_BANNER = gql`
  mutation upsertBanner($banner: BannerInput!) {
    upsertBanner(banner: $banner) {
      id
      slug
      name
      priority
      enabled
      placement
      source {
        kind
        ratio
        src
      }
      link
      extras
      regions {
        nodes {
          id
          name
        }
        count
      }
      groups {
        nodes {
          id
          name
        }
        count
      }
    }
  }
`;

export interface MVars {
  banner: BannerInput;
}
