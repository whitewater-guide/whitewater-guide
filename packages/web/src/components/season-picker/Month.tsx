import type { Theme } from '@material-ui/core/styles';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { getMonthName } from '@whitewater-guide/clients';
import React from 'react';

interface Props {
  index: number;
}

const useStyles = makeStyles(({ palette }: Theme) =>
  createStyles({
    root: ({ index }: Props) => {
      const isLast = index === 11;
      const border = `1px solid ${palette.grey[400]}`;
      return {
        display: 'flex',
        boxSizing: 'border-box',
        flex: 1,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        overflow: 'hidden',
        backgroundColor: palette.grey[200],
        borderTop: border,
        borderBottom: border,
        borderLeft: border,
        borderRight: isLast ? border : undefined,
      };
    },
  }),
);

const Month = React.memo<Props>((props) => {
  const classes = useStyles(props);
  return <div className={classes.root}>{getMonthName(props.index, false)}</div>;
});

Month.displayName = 'Month';

export default Month;
