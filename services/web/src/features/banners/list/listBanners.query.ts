import { BannerFragments } from '@whitewater-guide/clients';
import { BannerCore, Connection, NamedNode } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const LIST_BANNERS = gql`
  query listBanners {
    banners {
      nodes {
        ...BannerCore
        regions {
          nodes {
            id
            name
          }
        }
        groups {
          nodes {
            id
            name
          }
        }
      }
      count
    }
  }
  ${BannerFragments.Core}
`;

export type ListedBanner = BannerCore & {
  regions: Required<Connection<NamedNode>>;
  groups: Required<Connection<NamedNode>>;
};

export interface QResult {
  banners: Required<Connection<ListedBanner>>;
}
