import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { FC } from 'react';

const useStyles = makeStyles(() =>
  createStyles({
    overlay: {
      position: 'absolute',
      overflow: 'hidden',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      color: 'white',
      cursor: 'pointer',
      textAlign: 'right',
      opacity: 0,
      '&:hover': {
        opacity: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
      },
      '& .MuiIcon-root': {
        color: 'white',
      },
    },
  }),
);

interface Props {
  thumb: string;
  width?: number;
  height?: number;
  editable?: boolean;
  onEdit?: (e: React.MouseEvent<{}>) => void;
  onRemove?: (e: React.MouseEvent<{}>) => void;
}

const ThumbImage: FC<Props> = (props) => {
  const { thumb, width, height, editable, onEdit, onRemove } = props;
  const classes = useStyles();

  return (
    <React.Fragment>
      <img src={thumb} style={{ width, height }} />
      <div className={classes.overlay} style={{ width, height }}>
        {editable && (
          <React.Fragment>
            <IconButton onClick={onEdit}>
              <Icon>edit</Icon>
            </IconButton>
            <IconButton onClick={onRemove}>
              <Icon>delete_forever</Icon>
            </IconButton>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};

export default ThumbImage;
