import { toRomanDifficulty } from '@whitewater-guide/clients';
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

export const DifficultyThumb: React.SFC<Props> = ({
  difficulty,
  difficultyXtra,
  noBorder,
}) => {
  const style = noBorder
    ? styles.container
    : [styles.container, styles.withBorder];
  return (
    <View style={style}>
      <Text style={styles.mainLine}>
        {toRomanDifficulty(difficulty).replace(/\s/gi, '')}
      </Text>
      {!!difficultyXtra && (
        <Text style={styles.xtraLine}>{`(${difficultyXtra})`}</Text>
      )}
    </View>
  );
};
