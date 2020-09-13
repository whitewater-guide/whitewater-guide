import MUICard, { CardProps } from '@material-ui/core/Card';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';

import { Loading } from '../components';
import { CardContent } from './CardContent';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      margin: theme.spacing(3),
      flex: 1,
      flexDirection: 'column',
      '& .MuiCardHeader-root': {
        height: 48,
        backgroundColor: theme.palette.primary.main,
      },
      '& .MuiCardHeader-title': {
        color: theme.palette.primary.contrastText,
      },
      '& .MuiCardContent-root': {
        padding: 0,
        flex: 1,
        overflowY: 'auto',
      },
    },
  }),
);

interface Props extends CardProps {
  loading?: boolean;
}

export const Card: React.FC<Props> = React.memo((props) => {
  const { loading, children, ...cardProps } = props;
  const classes = useStyles();
  const content = loading ? (
    <CardContent>
      <Loading />
    </CardContent>
  ) : (
    children
  );
  return (
    <MUICard {...cardProps} classes={classes}>
      {content}
    </MUICard>
  );
});

Card.displayName = 'Card';
