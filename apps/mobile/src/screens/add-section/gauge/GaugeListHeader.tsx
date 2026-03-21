import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import OfflineListHeader from '~/components/OfflineListHeader';
import theme from '~/theme';

const styles = StyleSheet.create({
  loadingWrapper: {
    // alignSelf: 'stretch',
    height: theme.rowHeight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: theme.margin.single,
  },
});

interface Props {
  loading: boolean;
}

const GaugeListHeader: React.FC<Props> = ({ loading }) => {
  if (loading) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator color={theme.colors.primary} size="small" />
      </View>
    );
  }
  return <OfflineListHeader />;
};

GaugeListHeader.displayName = 'GaugeListHeader';

export default GaugeListHeader;
