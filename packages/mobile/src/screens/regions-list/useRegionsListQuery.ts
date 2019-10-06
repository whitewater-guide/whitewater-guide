import { Connection, Region } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import theme from '../../theme';

export const REGIONS_LIST_QUERY = gql`
  query regionsList {
    regions {
      nodes {
        id
        name
        premium
        hasPremiumAccess
        sku
        gauges {
          count
        }
        sections {
          count
        }
        coverImage {
          mobile(width: ${theme.screenWidthPx})
        }
      }
      count
    }
  }
`;

interface Result {
  regions: Required<Connection<Region>>;
}

export default () =>
  useQuery<Result>(REGIONS_LIST_QUERY, {
    fetchPolicy: 'cache-and-network',
  });
