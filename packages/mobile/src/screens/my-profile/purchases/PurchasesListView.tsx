import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { Divider, Title } from 'react-native-paper';
import { ErrorBoundary, Loading, Paper } from '../../../components';
import { MY_PURCHASES_QUERY, Result } from './myPurchases.query';
import PurchaseItem from './PurchaseItem';

const PurchasesListView: React.FC = () => {
  const [t] = useTranslation();
  return (
    <ErrorBoundary>
      <Paper>
        <Title>{t('myProfile:purchases.title')}</Title>
        <Divider />
        <Query query={MY_PURCHASES_QUERY} fetchPolicy="cache-and-network">
          {({ data, loading }: QueryResult<Result>) => {
            if (loading) {
              return <Loading />;
            }
            if (!data || !data.me) {
              return null;
            }
            const {
              me: { purchasedGroups, purchasedRegions },
            } = data;
            return [
              ...purchasedGroups.map((group, index) => (
                <PurchaseItem
                  key={group.id}
                  group={group}
                  last={
                    purchasedRegions.length === 0
                      ? index === purchasedGroups.length - 1
                      : false
                  }
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
};

export default PurchasesListView;
