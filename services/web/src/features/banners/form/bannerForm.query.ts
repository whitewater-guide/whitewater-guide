import { BannerFragments } from '@whitewater-guide/clients';
import {
  BannerCore,
  Connection,
  NamedNode,
  UploadLink,
} from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const BANNER_FORM_QUERY = gql`
  query bannerForm($bannerId: ID) {
    banner(id: $bannerId) {
      ...BannerCore
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

    uploadLink {
      postURL
      formData
      key
    }
  }
  ${BannerFragments.Core}
`;

export interface QVars {
  bannerId?: string;
}

export interface QResult {
  banner: BannerCore & {
    regions: Connection<NamedNode>;
    groups: Connection<NamedNode>;
  };
  regions: Connection<NamedNode>;
  groups: Connection<NamedNode>;
  uploadLink: UploadLink;
}
