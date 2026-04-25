import { ActivityIndicator, StyleSheet, View } from 'react-native';

import theme from '../../../theme';

const styles = StyleSheet.create({
  loadingWrapper: {
    height: theme.rowHeight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: theme.margin.single,
  },
});

interface Props {
  loading: boolean;
}

function GaugeListHeader({ loading }: Props) {
  if (!loading) {
    return null;
  }
  return (
    <View style={styles.loadingWrapper}>
      <ActivityIndicator color={theme.colors.primary} size="small" />
    </View>
  );
}

export default GaugeListHeader;
