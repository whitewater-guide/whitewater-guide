import React from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { toRomanDifficulty } from '../../../commons/utils/TextUtils';

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    pointerEvents: 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
  },
  tick: {
    flex: 1,
    width: 1,
  },
};

const WholeDifficulty = ({ value, muiTheme }) => (
  <div style={styles.container}>
    <div style={{ ...styles.tick, backgroundColor: muiTheme.palette.accent3Color }} />
    <span style={{ color: muiTheme.palette.textColor }}>{ `${toRomanDifficulty(value)}` }</span>
    <div style={{ ...styles.tick, backgroundColor: muiTheme.palette.accent3Color }} />
  </div>
);

WholeDifficulty.propTypes = {
  value: PropTypes.number.isRequired,
  muiTheme: PropTypes.object,
};

export default muiThemeable()(WholeDifficulty);
