import { getMonthName } from '@whitewater-guide/clients';
import type { ReactNode } from 'react';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import theme from '../../../../theme';
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

interface MonthProps {
  index: number;
  children: ReactNode;
}

interface MonthStatics {
  height: number;
}

const MonthBase = memo<MonthProps>(({ index, children }) => (
  <View style={styles.container}>
    <View style={[styles.labelWrapper, index % 3 < 2 && styles.labelBorder]}>
      <Text style={styles.label}>{getMonthName(index)}</Text>
    </View>
    <View style={[styles.halves, index % 3 < 2 && styles.halvesBorder]}>
      {children}
    </View>
  </View>
));

MonthBase.displayName = 'Month';

const Month: typeof MonthBase & MonthStatics = Object.assign(MonthBase, {
  height: HalfMonth.height + HEADER_HEIGHT,
});

export default Month;
