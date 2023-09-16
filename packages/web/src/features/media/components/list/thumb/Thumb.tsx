import { createStyles, makeStyles } from '@material-ui/core/styles';
import type { FC } from 'react';
import React from 'react';

import BrokenImage from './BrokenImage';
import { THUMB_HEIGHT } from './constants';
import ThumbImage from './ThumbImage';
import type { ThumbProps } from './types';
import useThumb from './useThumb';

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    container: {
      position: 'relative',
      marginRight: spacing(2),
      marginBottom: spacing(2),
      height: THUMB_HEIGHT,
    },
  }),
);

const Thumb: FC<ThumbProps> = (props) => {
  const { index, media, editable, onClick, onEdit, onRemove } = props;
  const classes = useStyles();
  const { thumb, width, height } = useThumb(media);

  const commons = {
    editable,
    onEdit: (e: React.MouseEvent) => {
      e.stopPropagation();
      onEdit?.(media);
    },
    onRemove: (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove?.(media);
    },
  };

  return (
    <div
      className={classes.container}
      onClick={thumb ? () => onClick?.(media, index) : undefined}
    >
      {thumb ? (
        <ThumbImage thumb={thumb} width={width} height={height} {...commons} />
      ) : (
        <BrokenImage media={media} {...commons} />
      )}
    </div>
  );
};

export default Thumb;
