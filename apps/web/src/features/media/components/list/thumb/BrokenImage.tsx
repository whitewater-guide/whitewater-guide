import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import type { FC } from 'react';
import React from 'react';

import type { ListedMedia } from '../types';
import { THUMB_HEIGHT } from './constants';

const useStyles = makeStyles(() =>
  createStyles({
    brokenImage: {
      width: THUMB_HEIGHT,
      height: THUMB_HEIGHT,
      boxSizing: 'border-box',
      borderRadius: 0,
      borderWidth: 4,
      borderColor: '#BBBBBB',
      borderStyle: 'solid',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
    },
    brokenImageMenu: {
      display: 'flex',
      justifyContent: 'flex-end',
      height: 48,
    },
    brokenImageBody: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      marginTop: 12,
      textAlign: 'center',
    },
  }),
);

interface Props {
  media: ListedMedia;
  editable?: boolean;
  onEdit?: (e: React.MouseEvent) => void;
  onRemove?: (e: React.MouseEvent) => void;
}

const BrokenImage: FC<Props> = ({ editable, media, onEdit, onRemove }) => {
  const classes = useStyles();
  return (
    <div className={classes.brokenImage}>
      <div className={classes.brokenImageMenu}>
        {editable && (
          <>
            <IconButton onClick={onEdit}>
              <Icon color="error">edit</Icon>
            </IconButton>
            <IconButton onClick={onRemove}>
              <Icon>delete_forever</Icon>
            </IconButton>
          </>
        )}
      </div>
      <div className={classes.brokenImageBody}>
        <span className={classes.text}>Cannot render thumb</span>
        {!!media.url && (
          <a
            href={media.url}
            className={classes.text}
            target="_blank"
            rel="noreferrer"
          >
            go see yourself
          </a>
        )}
      </div>
    </div>
  );
};

export default BrokenImage;
