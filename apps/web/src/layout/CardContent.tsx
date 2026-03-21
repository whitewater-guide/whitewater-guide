import type { CardContentProps } from '@material-ui/core/CardContent';
import MUICardContent from '@material-ui/core/CardContent';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(() =>
  createStyles({
    cardContent: {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
  }),
);

export const CardContent: React.FC<CardContentProps> = (props) => {
  const classes = useStyles();
  return <MUICardContent {...props} className={classes.cardContent} />;
};
