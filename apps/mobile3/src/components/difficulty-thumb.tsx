import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { toRomanDifficulty } from '@/utils/to-roman-difficulty';

const denseRomanCache = new Map<number, string>();

function denseRoman(difficulty: number): string {
  const cached = denseRomanCache.get(difficulty);
  if (cached) {
    return cached;
  }
  const value = toRomanDifficulty(difficulty).replace(/\s/gi, '');
  denseRomanCache.set(difficulty, value);
  return value;
}

export interface DifficultyThumbProps {
  difficulty: number | null;
  difficultyXtra?: string | null;
  noBorder?: boolean;
}

function DifficultyThumb({
  difficulty,
  difficultyXtra,
  noBorder,
}: DifficultyThumbProps) {
  const theme = useTheme();
  const style = noBorder ? styles.withoutBorder : styles.withBorder;
  const textStyle = useMemo(
    () => [styles.mainLine, { color: theme.text }],
    [theme.text],
  );
  const extraStyle = useMemo(
    () => [styles.xtraLine, { color: theme.text }],
    [theme.text],
  );

  if (difficulty === null) {
    return null;
  }

  return (
    <View style={style}>
      <Text style={textStyle}>{denseRoman(difficulty)}</Text>
      {!!difficultyXtra && (
        <Text style={extraStyle}>{`(${difficultyXtra})`}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  withoutBorder: {
    width: 60,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  withBorder: {
    width: 60,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#9E9E9E',
    borderRightWidth: StyleSheet.hairlineWidth,
    paddingRight: 4,
    marginRight: 4,
  },
  mainLine: {
    fontSize: 24,
    fontWeight: '400',
  },
  xtraLine: {
    fontSize: 10,
    transform: [{ translateY: -4 }],
  },
});

export default memo(DifficultyThumb);
