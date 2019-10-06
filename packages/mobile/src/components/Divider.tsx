import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Paragraph } from 'react-native-paper';
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

const Divider: React.FC<DividerProps & ViewProps> = ({
  label,
  style,
  ...props
}) => (
  <View style={[styles.wrapper, style]} {...props}>
    <View style={styles.line} />
    {!!label && <Paragraph style={styles.text}>{label}</Paragraph>}
    {!!label && <View style={styles.line} />}
  </View>
);

export default Divider;
