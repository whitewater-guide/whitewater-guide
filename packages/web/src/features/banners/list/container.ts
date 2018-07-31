import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { withDeleteMutation } from '../../../apollo';
import { withLoading } from '../../../components';
import { queryResultToList, WithList } from '../../../ww-clients/apollo';
import { Banner, Connection } from '../../../ww-commons';
import REMOVE_BANNER from './removeBanner.mutation';
import LIST_BANNERS from './listBanners.query';
import { BannerListProps } from './types';

interface Result {
  banners: Connection<Banner>;
}

export interface WithBannersList {
  banners: WithList<Banner>;
}

const withBannersList = graphql<any, Result, any, WithBannersList>(
  LIST_BANNERS,
  {
    alias: 'withBannersList',
    options: () => ({
      fetchPolicy: 'cache-and-network',
    }),
    props: props => queryResultToList(props, 'banners'),
  },
);

export default compose<BannerListProps, {}>(
  withBannersList,
  withDeleteMutation({
    mutation: REMOVE_BANNER,
    propName: 'removeBanner',
    refetchQueries: ['listBanners'],
  }),
  withLoading<WithBannersList>(({ banners }) => banners.loading),
);
