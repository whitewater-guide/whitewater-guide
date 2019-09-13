import { getMonthName } from '@whitewater-guide/clients';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../../../../theme';
import HalfMonth from './HalfMonth';

const HEADER_HEIGHT = 24;

const styles = StyleSheet.create({
  container: {
    width: HalfMonth.width * 2,
    backgroundColor: theme.colors.border,
  },
  halvesBorder: {
    borderColor: theme.colors.primary,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  labelWrapper: {
    backgroundColor: theme.colors.primary,
    height: HEADER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelBorder: {
    borderColor: theme.colors.textLight,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 12,
    color: theme.colors.textLight,
    textTransform: 'uppercase',
  },
  halves: {
    flexDirection: 'row',
  },
});

interface Props {
  index: number;
  children: any;
}

type Month = React.FC<Props> & { height: number };

const Month: Month = Object.assign(
  React.memo((props: Props) => {
    const { index, children } = props;
    return (
      <View style={styles.container}>
        <View
          style={[styles.labelWrapper, index % 3 < 2 && styles.labelBorder]}
        >
          <Text style={styles.label}>{getMonthName(index)}</Text>
        </View>
        <View style={[styles.halves, index % 3 < 2 && styles.halvesBorder]}>
          {children}
        </View>
      </View>
    );
  }),
  { height: HalfMonth.height + HEADER_HEIGHT },
);

Month.displayName = 'Month';

export default Month;
