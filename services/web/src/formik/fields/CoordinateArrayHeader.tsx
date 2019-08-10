import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { lineString } from '@turf/helpers';
import length from '@turf/length';
import { Coordinate } from '@whitewater-guide/commons';
import React from 'react';

const useStyles = makeStyles(() =>
  createStyles({
    header: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    lengthBlock: {
      flex: 1,
    },
  }),
);

interface Props {
  value: Coordinate[];
  onReverse?: () => void;
}

const CoordinateArrayHeader: React.FC<Props> = React.memo((props) => {
  const { value, onReverse } = props;
  const classes = useStyles();
  const distance =
    value.length >= 2 ? length(lineString(value), { units: 'kilometers' }) : 0;
  return (
    <div className={classes.header}>
      <div className={classes.lengthBlock}>
        <strong>Distance:</strong> {`${distance.toFixed(3)} km`}
      </div>

      <Tooltip title="Swap put-in and take-out">
        <IconButton disabled={value.length < 2} onClick={onReverse}>
          <Icon>swap_calls</Icon>
        </IconButton>
      </Tooltip>
    </div>
  );
});

CoordinateArrayHeader.displayName = 'CoordinateArrayHeader';

export default CoordinateArrayHeader;
