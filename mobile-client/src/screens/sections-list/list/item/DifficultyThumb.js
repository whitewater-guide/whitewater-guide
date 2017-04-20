import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { toRomanDifficulty } from '../../../../commons/utils/TextUtils';

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 52,
    paddingHorizontal: 4,
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#c9c9c9',
    borderRightWidth: 1,
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

const DifficultyThumb = ({ difficulty, difficultyXtra }) => (
  <View style={styles.container}>
    <Text style={styles.mainLine}>{toRomanDifficulty(difficulty).replace(/\s/gi, '')}</Text>
    { difficultyXtra && <Text style={styles.xtraLine}>{`(${difficultyXtra})`}</Text>}
  </View>
);

DifficultyThumb.propTypes = {
  difficulty: PropTypes.number.isRequired,
  difficultyXtra: PropTypes.string,
};

DifficultyThumb.defaultProps = {
  difficultyXtra: '',
};

export default DifficultyThumb;
