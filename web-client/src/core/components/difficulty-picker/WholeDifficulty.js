import React from 'react';
import PropTypes from 'prop-types';
import { toRomanDifficulty } from '../../../commons/utils/TextUtils';

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    pointerEvents: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
  },
};

const WholeDifficulty = ({ value }) => (
  <div style={styles.container}>
    { `${toRomanDifficulty(value)}` }
  </div>
);

WholeDifficulty.propTypes = {
  value: PropTypes.number.isRequired,
};

export default WholeDifficulty;
