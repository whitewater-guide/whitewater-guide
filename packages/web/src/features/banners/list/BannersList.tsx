import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import React from 'react';
import { RouteComponentProps } from 'react-router';

import { useDeleteMutation } from '../../../apollo';
import { Card, EditorFooter } from '../../../layout';
import BannersTable from './BannersTable';
import {
  ListBannersDocument,
  useListBannersQuery,
} from './listBanners.generated';
import { RemoveBannerDocument } from './removeBanner.generated';

export const BannersList = React.memo<RouteComponentProps>(({ history }) => {
  const { data, loading } = useListBannersQuery({
    fetchPolicy: 'cache-and-network',
  });
  const removeBanner = useDeleteMutation(RemoveBannerDocument, [
    { query: ListBannersDocument },
  ]);

  return (
    <Card loading={loading}>
      <CardHeader title="Banners list" />
      <CardContent>
        <BannersTable
          history={history}
          banners={data?.banners?.nodes}
          onRemove={removeBanner}
        />
      </CardContent>
      <EditorFooter add />
    </Card>
  );
});

BannersList.displayName = 'BannersList';
