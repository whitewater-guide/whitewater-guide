import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { toRomanDifficulty } from '../commons/utils/TextUtils';

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 52,
    alignItems: 'center',
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
    transform: [
      { translateY: -4 },
    ],
  },
});

const DifficultyThumb = ({ difficulty, difficultyXtra, noBorder }) => {
  const style = noBorder ? styles.container : [styles.container, styles.withBorder];
  return (
    <View style={style}>
      <Text style={styles.mainLine}>{toRomanDifficulty(difficulty).replace(/\s/gi, '')}</Text>
      { difficultyXtra && <Text style={styles.xtraLine}>{`(${difficultyXtra})`}</Text>}
    </View>
  );
};

DifficultyThumb.displayName = 'DifficultyThumb';

DifficultyThumb.propTypes = {
  difficulty: PropTypes.number.isRequired,
  difficultyXtra: PropTypes.string,
  noBorder: PropTypes.bool,
};

DifficultyThumb.defaultProps = {
  difficultyXtra: '',
  noBorder: false,
};

export default DifficultyThumb;
