import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useState } from 'react';

import { DrawingMap } from './DrawingMap';
import { DrawingMode } from './types';

const useStyles = makeStyles(() =>
  createStyles({
    content: {
      width: '90vw',
      height: 'calc(100vh - 240px)',
    },
  }),
);

const MIN_POINTS: { [key in DrawingMode]: number } = {
  Point: 1,
  LineString: 2,
  Polygon: 3,
};

interface Props {
  drawingMode: DrawingMode;
  points?: CodegenCoordinates[];
  bounds: CodegenCoordinates[] | null;
  onClose: () => void;
  onSubmit: (points: CodegenCoordinates[]) => void;
}

export const SelectGeometryDialog: React.FC<Props> = (props) => {
  const { points: ptz, drawingMode, bounds, onClose, onSubmit } = props;
  const classes = useStyles();
  const [points, setPoints] = useState([...(ptz || [])]);
  const disabled = points.length < MIN_POINTS[drawingMode];
  const handleSubmit = useCallback(() => {
    onSubmit(points);
    onClose();
  }, [onClose, onSubmit, points]);
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth={false}>
      <DialogTitle>{`Choose ${drawingMode.toLowerCase()}`}</DialogTitle>
      <DialogContent className={classes.content}>
        <DrawingMap
          drawingMode={drawingMode}
          points={points}
          bounds={bounds}
          onChange={setPoints}
        />
      </DialogContent>
      <DialogActions>
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="primary"
          key="submit"
          disabled={disabled}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
