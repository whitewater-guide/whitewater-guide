import { createStyles, makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import ToggleButton from '@material-ui/lab/ToggleButton';
import React, { useCallback } from 'react';

import { GoogleMapControlProps } from '../../../components/maps/GoogleMap';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: 40,
    },
    container: {
      marginRight: 10,
      marginTop: 10,
      backgroundColor: 'white',
    },
  }),
);

interface Props extends GoogleMapControlProps {
  enabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const GaugesMapSwitch: React.FC<Props> = ({ enabled, setEnabled }) => {
  const onChange = useCallback(() => {
    setEnabled((e) => !e);
  }, [setEnabled]);

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <ToggleButton
        value="check"
        selected={enabled}
        onChange={onChange}
        classes={classes}
      >
        <CheckIcon />
        Show gauges
      </ToggleButton>
    </div>
  );
};

export default GaugesMapSwitch;
