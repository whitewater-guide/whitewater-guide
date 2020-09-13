import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import React, { useMemo } from 'react';
import { useQuery } from 'react-apollo';
import { RouteComponentProps } from 'react-router';

import { useDeleteMutation } from '../../../apollo';
import { squashConnection } from '../../../formik/utils';
import { Card, EditorFooter } from '../../../layout';
import BannersTable from './BannersTable';
import { LIST_BANNERS, QResult } from './listBanners.query';
import { REMOVE_BANNER } from './removeBanner.mutation';

export const BannersList: React.FC<RouteComponentProps> = React.memo(
  ({ history }) => {
    const { data, loading } = useQuery<QResult>(LIST_BANNERS, {
      fetchPolicy: 'cache-and-network',
    });
    const removeBanner = useDeleteMutation(REMOVE_BANNER, [
      { query: LIST_BANNERS },
    ]);

    const banners = useMemo(() => squashConnection(data, 'banners'), [data]);
    return (
      <Card loading={loading}>
        <CardHeader title="Banners list" />
        <CardContent>
          <BannersTable
            history={history}
            banners={banners}
            onRemove={removeBanner}
          />
        </CardContent>
        <EditorFooter add={true} />
      </Card>
    );
  },
);

BannersList.displayName = 'BannersList';
