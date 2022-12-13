import { SafeSectionDetails } from '@whitewater-guide/clients';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import Loading from '~/components/Loading';
import { useIap } from '~/features/purchases';
import theme from '~/theme';

import NoDataPlaceholder from './NoDataPlaceholder';
import PremiumPlaceholder from './PremiumPlaceholder';

const styles = StyleSheet.create({
  loading: {
    height: 2 * theme.rowHeight,
    backgroundColor: theme.colors.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface Props {
  premium: boolean;
  section: SafeSectionDetails;
  loading?: boolean;
}

const Placeholder: FC<Props> = ({ premium, section, loading }) => {
  const { canMakePayments } = useIap();

  if (premium && canMakePayments) {
    return <PremiumPlaceholder section={section} />;
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <Loading />
      </View>
    );
  }

  return <NoDataPlaceholder />;
};

export default Placeholder;
