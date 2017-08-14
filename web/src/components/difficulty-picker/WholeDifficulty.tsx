import muiThemeable from 'material-ui/styles/muiThemeable';
import * as React from 'react';
import { Styles, Themeable } from '../../styles/types';
import { toRomanDifficulty } from '../../ww-clients/utils/TextUtils';

const styles: Styles = {
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

interface Props extends Themeable {
  value: number;
}

const WholeDifficulty: React.StatelessComponent<Props> = ({ value, muiTheme }) => (
  <div style={styles.container}>
    <div style={{ ...styles.tick, backgroundColor: muiTheme.palette!.accent3Color }} />
    <span style={{ color: muiTheme.palette!.textColor }}>{`${toRomanDifficulty(value)}`}</span>
    <div style={{ ...styles.tick, backgroundColor: muiTheme.palette!.accent3Color }} />
  </div>
);

export default muiThemeable()(WholeDifficulty);
