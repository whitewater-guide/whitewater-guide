import type { ViewProps } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import theme from '../theme';

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: theme.margin.single,
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.componentBorder,
  },
  text: {
    marginHorizontal: theme.margin.single,
  },
});

interface DividerProps {
  label?: string;
}

function Divider({ label, style, ...props }: DividerProps & ViewProps) {
  return (
    <View style={[styles.wrapper, style]} {...props}>
      <View style={styles.line} />
      {!!label && <Text style={styles.text}>{label}</Text>}
      {!!label && <View style={styles.line} />}
    </View>
  );
}

export default Divider;
