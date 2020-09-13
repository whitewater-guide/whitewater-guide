import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import times from 'lodash/times';
import xor from 'lodash/xor';
import React, { useCallback } from 'react';

import HalfMonth from './HalfMonth';
import Month from './Month';

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      alignItems: 'stretch',
      overflow: 'hidden',
      margin: spacing(1, 0),
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      height: 48,
      overflow: 'hidden',
      borderBottom: `1px solid ${palette.divider}`,
    },
  }),
);

interface Props {
  name?: string;
  title?: string;
  value: number[];
  onChange: (value: number[]) => void;
}

export const SeasonPicker: React.FC<Props> = React.memo((props) => {
  const classes = useStyles();
  const { title, value, onChange } = props;
  const onToggle = useCallback(
    (index: number) => {
      onChange(xor(value, [index]).sort((a, b) => a - b));
    },
    [value, onChange],
  );
  const renderMonth = useCallback(
    (index: number) => <Month key={`m${index}`} index={index} />,
    [],
  );
  const renderHalf = useCallback(
    (index: number) => (
      <HalfMonth
        key={`hm${index}`}
        index={index}
        value={value}
        onToggle={onToggle}
      />
    ),
    [value, onToggle],
  );
  return (
    <div className={classes.container}>
      {title && <Typography>{title}</Typography>}
      <div className={classes.row}>{times(12, renderMonth)}</div>
      <div className={classes.row}>{times(24, renderHalf)}</div>
    </div>
  );
});

SeasonPicker.displayName = 'SeasonPicker';
