import { createStyles, makeStyles } from '@material-ui/core/styles';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import React from 'react';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
      flex: 1,
    },
    head: {
      borderBottomColor: theme.palette.grey[800],
    },
  }),
);

interface Props {
  className?: string;
  variant?: TableCellProps['variant'];
}

export const MUICell: React.FC<Props> = React.memo(({ variant, children }) => {
  const classes = useStyles();
  return (
    <TableCell component="div" classes={classes} variant={variant}>
      {children}
    </TableCell>
  );
});

MUICell.displayName = 'MUICell';
