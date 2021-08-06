import { toRomanDifficulty } from '@whitewater-guide/clients';
import memoize from 'lodash/memoize';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  withBorder: {
    justifyContent: 'center',
    borderColor: '#c9c9c9',
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

interface Props {
  difficulty: number;
  difficultyXtra?: string | null;
  noBorder?: boolean;
}

const denseRoman = memoize((difficulty: number) =>
  toRomanDifficulty(difficulty).replace(/\s/gi, ''),
);

const DifficultyThumb: React.FC<Props> = React.memo(
  ({ difficulty, difficultyXtra, noBorder }) => {
    const style = noBorder
      ? styles.container
      : [styles.container, styles.withBorder];
    return (
      <View style={style}>
        <Text style={styles.mainLine}>{denseRoman(difficulty)}</Text>
        {!!difficultyXtra && (
          <Text style={styles.xtraLine}>{`(${difficultyXtra})`}</Text>
        )}
      </View>
    );
  },
);

DifficultyThumb.displayName = 'DifficultyThumb';

export default DifficultyThumb;
