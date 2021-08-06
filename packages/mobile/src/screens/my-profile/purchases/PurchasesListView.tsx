import React from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Title } from 'react-native-paper';

import ErrorBoundary from '~/components/ErrorBoundary';
import Loading from '~/components/Loading';
import Paper from '~/components/Paper';

import { useMyPurchasesQuery } from './myPurchases.generated';
import PurchaseItem from './PurchaseItem';

const PurchasesList: React.FC = () => {
  const { data, loading } = useMyPurchasesQuery({
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return <Loading />;
  }
  if (!data || !data.me) {
    return null;
  }
  const {
    me: { purchasedGroups, purchasedRegions },
  } = data;
  return (
    <>
      {purchasedGroups.map((group, index) => (
        <PurchaseItem
          key={group.id}
          group={group}
          last={
            purchasedRegions.length === 0
              ? index === purchasedGroups.length - 1
              : false
          }
        />
      ))}
      {purchasedRegions.map((region, index) => (
        <PurchaseItem
          key={region.id}
          region={region}
          last={index === purchasedRegions.length - 1}
        />
      ))}
    </>
  );
};

const PurchasesListView: React.FC = () => {
  const { t } = useTranslation();
  return (
    <ErrorBoundary>
      <Paper>
        <Title>{t('myProfile:purchases.title')}</Title>
        <Divider />
        <PurchasesList />
      </Paper>
    </ErrorBoundary>
  );
};

export default PurchasesListView;
