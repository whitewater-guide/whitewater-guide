import type { FC } from 'react';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import theme from '~/theme';

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
  },
});

const RiversListSeparator: FC = () => {
  return <View style={styles.separator} />;
};

export default RiversListSeparator;
