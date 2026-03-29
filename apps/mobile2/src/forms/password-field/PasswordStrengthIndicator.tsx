import { zxcvbn } from '@zxcvbn-ts/core';
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import theme from '../../theme';
import './zxcvbnSetup';

const COLORS = [
  theme.colors.error,
  theme.colors.error,
  '#FF9800', // orange 500
  '#FFEB3B', // yellow 500
  '#4CAF50', // green 500
];

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: theme.margin.half,
  },
  bar: {
    flex: 1,
    height: theme.margin.half,
    backgroundColor: theme.colors.componentBorder,
    marginRight: theme.margin.single,
  },
  progress: {
    height: theme.margin.half,
  },
  label: {
    textAlign: 'right',
    minWidth: 80,
  },
});

interface Props {
  value?: string;
  style?: StyleProp<ViewStyle>;
}

function PasswordStrengthIndicator({ value, style }: Props) {
  const [score, setScore] = useState(0);
  const { t } = useTranslation();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const result = zxcvbn(value || '');
    setScore(result.score);
  }, [value]);

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const progressStyle = useMemo(
    () => [
      styles.progress,
      {
        width: (width * (score + 1)) / 5,
        backgroundColor: COLORS[score],
      },
    ],
    [width, score],
  );

  return (
    <View style={[styles.root, style]}>
      <View style={styles.bar} onLayout={onLayout}>
        <View style={progressStyle} />
      </View>
      <Text variant="bodySmall" style={[styles.label, { color: COLORS[score] }]}>
        {t(`components:PasswordStrengthIndicator.strength${score}`)}
      </Text>
    </View>
  );
}

export default memo(PasswordStrengthIndicator);
