import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import ErrorBoundary from 'react-error-boundary';
import { translate } from 'react-i18next';
import { Divider, Title } from 'react-native-paper';
import { ErrorBoundaryFallback, Loading, Paper } from '../../../components';
import { WithT } from '../../../i18n';
import { MY_PURCHASES_QUERY, Result } from './myPurchases.query';
import PurchaseItem from './PurchaseItem';

const PurchasesListView: React.SFC<WithT> = ({ t }) => (
  <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
    <Paper>
      <Title>{t('myProfile:purchases.title')}</Title>
      <Divider />
      <Query query={MY_PURCHASES_QUERY} fetchPolicy="cache-and-network">
        {({ data, loading }: QueryResult<Result>) => {
          if (loading) {
            return <Loading />;
          }
          const { me: { purchasedGroups, purchasedRegions } } = data;
          return [
            ...purchasedGroups.map((group, index) => (
              <PurchaseItem
                key={group.id}
                group={group}
                last={purchasedRegions.length === 0 ? index === purchasedGroups.length - 1 : false}
              />
            )),
            ...purchasedRegions.map((region, index) => (
              <PurchaseItem
                key={region.id}
                region={region}
                last={index === purchasedRegions.length - 1}
              />
            )),
          ];
        }}
      </Query>
    </Paper>
  </ErrorBoundary>
);

export default translate()(PurchasesListView);
