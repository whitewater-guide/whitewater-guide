import { toRomanDifficulty } from '@whitewater-guide/clients';
import memoize from 'lodash/memoize';
import type { FC } from 'react';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import theme from '~/theme';

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
    borderColor: theme.colors.componentBorder,
    borderRightWidth: StyleSheet.hairlineWidth,
    paddingRight: 4,
    marginRight: 4,
  },
  mainLine: {
    fontSize: 24,
    fontWeight: '400',
    color: theme.colors.textMain,
  },
  xtraLine: {
    fontSize: 10,
    transform: [{ translateY: -4 }],
    color: theme.colors.textMain,
  },
});

interface Props {
  difficulty: number;
  difficultyXtra?: string | null;
  noBorder?: boolean;
}

const denseRoman = memoize((difficulty: number) =>
  toRomanDifficulty(difficulty).replace(/\s/gi, ''),
);

const DifficultyThumb: FC<Props> = ({
  difficulty,
  difficultyXtra,
  noBorder,
}) => {
  const style = noBorder ? styles.withoutBorder : styles.withBorder;
  return (
    <View style={style}>
      <Text style={styles.mainLine}>{denseRoman(difficulty)}</Text>
      {!!difficultyXtra && (
        <Text style={styles.xtraLine}>{`(${difficultyXtra})`}</Text>
      )}
    </View>
  );
};

DifficultyThumb.displayName = 'DifficultyThumb';

export default DifficultyThumb;
