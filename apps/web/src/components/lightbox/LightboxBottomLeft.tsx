import { createStyles, makeStyles } from '@material-ui/core/styles';
import type { ControlProps } from 'nuka-carousel';
import type { FC } from 'react';
import React from 'react';

import type { LightboxItem } from './types';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      color: theme.palette.common.white,
      padding: theme.spacing(2),
    },
  }),
);

interface Props extends ControlProps {
  items: LightboxItem[];
}

const LightboxBottomLeft: FC<Props> = ({ currentSlide, items }) => {
  const { copyright, description } = items[currentSlide];
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <span>{description}</span>
      {!!copyright && <span>{`© ${copyright}`}</span>}
    </div>
  );
};

export default LightboxBottomLeft;
