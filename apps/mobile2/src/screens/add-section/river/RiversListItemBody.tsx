import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import theme from '../../../theme';

const styles = StyleSheet.create({
  row: {
    height: theme.rowHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.margin.double,
    backgroundColor: theme.colors.lightBackground,
  },
  disabled: {
    opacity: 0.5,
  },
});

interface Props {
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

function RiversListItemBody(props: PropsWithChildren<Props>) {
  const { children, disabled, onPress, style } = props;
  return (
    <TouchableRipple onPress={onPress} disabled={disabled}>
      <View style={[styles.row, disabled && styles.disabled, style]}>
        {children}
      </View>
    </TouchableRipple>
  );
}

export default RiversListItemBody;
