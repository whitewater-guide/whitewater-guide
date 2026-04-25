import { StyleSheet, View } from 'react-native';

import theme from '../../../theme';

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
  },
});

function RiversListSeparator() {
  return <View style={styles.separator} />;
}

export default RiversListSeparator;
