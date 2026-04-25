import { StyleSheet, View } from 'react-native';

import theme from '../../../theme';

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
  },
});

function GaugesListSeparator() {
  return <View style={styles.separator} />;
}

export default GaugesListSeparator;
