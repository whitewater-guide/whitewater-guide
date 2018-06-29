import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import ErrorBoundary from 'react-error-boundary';
import { translate } from 'react-i18next';
import { Title } from 'react-native-paper';
import { ErrorBoundaryFallback, Loading } from '../../../components';
import { WithT } from '../../../i18n';
import { MY_PURCHASES_QUERY, Result } from './myPurchases.query';
import PurchaseItem from './PurchaseItem';

const PurchasesListView: React.SFC<WithT> = ({ t }) => (
  <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
    <Title>{t('myProfile:purchases.title')}</Title>
    <Query query={MY_PURCHASES_QUERY} fetchPolicy="cache-and-network">
      {({ data, loading }: QueryResult<Result>) => {
        if (loading) {
          return <Loading />;
        }
        const { me: { purchasedGroups, purchasedRegions } } = data;
        return [
          ...purchasedGroups.map((group) => (
            <PurchaseItem key={group.id} group={group} />
          )),
          ...purchasedRegions.map((region) => (
            <PurchaseItem key={region.id} region={region} />
          )),
        ];
      }}
    </Query>
  </ErrorBoundary>
);

export default translate()(PurchasesListView);
